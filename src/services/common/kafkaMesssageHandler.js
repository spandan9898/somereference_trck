/* eslint-disable no-promise-executor-return */
const _ = require("lodash");
const moment = require("moment");

const { getPrepareFunction } = require("./helpers");

const { updateTrackDataToPullMongo } = require("../pull");
const { redisCheckAndReturnTrackData } = require("../pull/services");

const sendDataToNdr = require("../ndr");
const sendTrackDataToV1 = require("../v1");
const triggerWebhook = require("../webhook");
const updateStatusOnReport = require("../report");

// const { preparePickrrConnectLambdaPayloadAndCall } = require("../../apps/pickrrConnect/services");

const { updatePrepareDict } = require("./helpers");
const {
  updateStatusELK,
  getTrackingIdProcessingCount,
  updateTrackingProcessingCount,
  commonTrackingDataProducer,
  updateFreshdeskTrackingTicket,
} = require("./services");
const { getElkClients } = require("../../utils");
const logger = require("../../../logger");
const { TrackingLogger } = require("../../../logger");
const { sendDataToElk } = require("./elk");
const commonTrackingInfoCol = require("../pull/model");
const { updateFlagForOtpDeliveredShipments } = require("../pull/helpers");
const { prepareTrackDataToUpdateInPullDb } = require("../pull/preparator");
const { EddPrepareHelper } = require("./eddHelpers");
const { getTrackDocumentfromMongo } = require("./trackServices");

const trackingLogger = TrackingLogger("tracking/payloads");

/**
 *
 * puts back otp data in trackEvent
 */
const putBackOtpDataInTrackEvent = async (obj, doc) => {
  const { scan_type: scanType, otp, otp_remarks: otpRemarks, scan_datetime: scanDateTime } = obj;
  try {
    let latestOtp;
    const eventScanTime = moment(scanDateTime).subtract(330, "m").toDate();
    const { track_arr: trackArr } = doc;
    for (let i = 0; i < trackArr.length; i += 1) {
      const { scan_type: dbScanType, scan_datetime: dbScanTime } = trackArr[i];
      const isSame = moment(eventScanTime).isSame(moment(dbScanTime));
      if (dbScanType === scanType && isSame) {
        if (otpRemarks) {
          trackArr[i].otp_remarks = otpRemarks;
        }
        if (otp) {
          trackArr[i].otp = otp;
          latestOtp = otp;
        }
        break;
      }
    }
    const isOtpDelivered = updateFlagForOtpDeliveredShipments(trackArr);
    return { track_arr: trackArr, latest_otp: latestOtp, is_otp_delivered: isOtpDelivered };
  } catch (error) {
    logger.error("Failed Backfilling Otp Data", error);
    return {};
  }
};

/**
 *
 * @param {obj to be updated} updatedObj
 * @param {trackingId} awb
 * @param {commonTrackingInfo Col Instance} colInstance
 */
const updateDataInPullDBAndReports = async (updatedObj, awb, colInstance) => {
  try {
    if (!awb || !updatedObj) {
      return {};
    }
    const updatedTrackDocument = colInstance.findOneAndUpdate(
      { tracking_id: awb },
      { $set: updatedObj }
    );
    await updateStatusOnReport(updatedTrackDocument);
  } catch (error) {
    logger.error("failed Updating Data");
    return {};
  }
};

/**
 *
 * @param {prepared Data from courier} obj
 * @param {col Instance} col
 * @param {is Pulled Event} isFromPulled
 */
const updateEDD = (obj, trackDocument, colInstance, isFromPulled) => {
  try {
    if (!trackDocument) {
      return {};
    }
    const updatedData = prepareTrackDataToUpdateInPullDb(obj, isFromPulled);
    const latestCourierEDD = updatedData?.eddStamp;
    const { pickup_datetime: pickupDateTime, edd_stamp: eddStampInDb, zone } = trackDocument;
    const statusType = trackDocument?.status?.current_status_type;
    const eddInstance = new EddPrepareHelper({
      latestCourierEDD,
      pickupDateTime,
      eddStampInDb,
    });
    const updatedEDD = eddInstance.callPickrrEDDEventFunc({
      zone,
      latestCourierEDD,
      pickupDateTime,
      eddStampInDb,
      statusType,
    });
    return { edd_stamp: updatedEDD };
  } catch (error) {
    logger.error("Failed Updating EDD for Duplicate Events");
    return {};
  }
};

/**
 * @desc get prepare data function and call others tasks like, send data to pull, ndr, v1
 */
class KafkaMessageHandler {
  /**
   *
   * @desc about processCount ->
   * 1. first fetch "processCount" from cache's awb object
   * 2. use default value 0
   * 3. Multiply this value with 1000
   * 4. then delay accordingly
   * 5. after DB update decrease "processCount" value by 1, handle negative case
   */
  static async init(consumedPayload, courierName) {
    const prepareFunc = getPrepareFunction(courierName);
    if (!prepareFunc) {
      return {
        error: `${courierName} is not a valid courier`,
      };
    }
    try {
      let res;
      let isFromPulled = false;

      const { prodElkClient, trackingElkClient } = getElkClients();

      try {
        const { message } = consumedPayload;
        const consumedData = JSON.parse(message.value.toString());

        if (consumedData?.event?.includes("pull")) {
          isFromPulled = true;
          res = prepareFunc(consumedData);
          if (courierName.includes("shadowfax_pull")) {
            sendDataToElk({
              body: {
                courier_name: courierName,
                payload: JSON.stringify(consumedData),
                time: new Date(),
              },
              elkClient: trackingElkClient,
              indexName: "track_courier_pull",
            });
          }
        } else {
          const consumedPayloadData = Object.values(consumedData)[0];
          try {
            if (process.env.IS_PAYLOAD_LOGGING === "true") {
              trackingLogger.info(courierName, {
                data: consumedPayloadData,
              });
            }
          } catch {
            // pass
          }
          res = prepareFunc(consumedPayloadData);
        }
      } catch (error) {
        res = prepareFunc(consumedPayload);
        isFromPulled = (_.get(consumedPayload, "event") || "").includes("pull");
      }

      if (!res.awb) return {};

      const processCount = await getTrackingIdProcessingCount({ awb: res.awb });

      await new Promise((done) => setTimeout(() => done(), processCount * 1000));

      await updateTrackingProcessingCount({ awb: res.awb });

      const trackData = await redisCheckAndReturnTrackData(res, isFromPulled);
      if (!trackData) {
        logger.info(`data already exists or not found in DB! ${res.awb}`);
        updateTrackingProcessingCount({ awb: res.awb }, "remove");

        const colInstance = await commonTrackingInfoCol();
        const trackDocument = await getTrackDocumentfromMongo(res.awb);

        if (!trackDocument) {
          return {};
        }

        let otpObj = {};
        if (!courierName.includes("pull")) {
          if (res.otp || res.otp_remarks) {
            // Otp Data Backfilling when kafka_pull is updating first
            // Otp Data is only recieved in kafka_Push events

            otpObj = await putBackOtpDataInTrackEvent(res, trackDocument, colInstance);
          }
        }
        const eddObj = await updateEDD(res, trackDocument, colInstance, isFromPulled);
        const updatedObj = { ...eddObj, ...otpObj };
        updateDataInPullDBAndReports(updatedObj, res.awb, colInstance);

        // All Updates happening here in single go

        return {};
      }
      let qcDetails = null;
      if (courierName === "shadowfax_pull" && isFromPulled) {
        qcDetails = res?.qc_details;
      }
      const updatedTrackData = await updatePrepareDict(trackData);
      if (_.isEmpty(updatedTrackData)) {
        logger.error("Xpresbees reverse map not found", trackData);
        updateTrackingProcessingCount({ awb: res.awb }, "remove");
        return {};
      }

      const result = await updateTrackDataToPullMongo({
        trackObj: updatedTrackData,
        logger,
        isFromPulled,
        qcDetails,
      });
      if (!result) {
        return {};
      }

      if (process.env.IS_OTHERS_CALL === "false") {
        return {};
      }
      await commonTrackingDataProducer(result);
      await updateStatusOnReport(result, logger, trackingElkClient);
      sendDataToNdr(result);
      sendTrackDataToV1(result);
      updateStatusELK(result, prodElkClient);
      triggerWebhook(result, trackingElkClient);
      updateFreshdeskTrackingTicket(result);

      // blocking events to lambda (new pickrr connect service)

      // preparePickrrConnectLambdaPayloadAndCall({
      //   trackingId: result.tracking_id,
      //   elkClient: trackingElkClient,
      //   result,
      // });

      return {};
    } catch (error) {
      logger.error("KafkaMessageHandler", error);
      return {};
    }
  }
}

module.exports = KafkaMessageHandler;

/* eslint-disable no-promise-executor-return */
const _ = require("lodash");
const moment = require("moment");

const { getPrepareFunction } = require("./helpers");

const { updateTrackDataToPullMongo } = require("../pull");
const { redisCheckAndReturnTrackData } = require("../pull/services");
const { updateEkartLatLong } = require("../pull/index");

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
const { TOPIC_NAME_TO_COURIER_NAME_MAPPER } = require("../../utils/constants");
const logger = require("../../../logger");
const { TrackingLogger } = require("../../../logger");
const { sendDataToElk } = require("./elk");
const commonTrackingInfoCol = require("../pull/model");
const { updateFlagForOtpDeliveredShipments } = require("../pull/helpers");
const { getTrackDocumentfromMongo } = require("./trackServices");

const trackingLogger = TrackingLogger("tracking/payloads");

/**
 *
 * puts back otp data in trackEvent
 */
const updateFieldsForDuplicateEvent = async (obj) => {
  const {
    scan_type: scanType,
    otp,
    otp_remarks: otpRemarks,
    scan_datetime: scanDateTime,
    latitude,
    longitude,
  } = obj;
  try {
    let lat;
    let long;
    const doc = await getTrackDocumentfromMongo(obj.awb, obj.couriers);

    // Otp Data Backfilling when kafka_pull is updating first
    // Otp Data is only recieved in kafka_Push events

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
        }
        if (latitude) {
          trackArr[i].latitude = latitude;
          lat = latitude;
        }
        if (longitude) {
          trackArr[i].longitude = longitude;
          long = longitude;
        }
        break;
      }
    }
    const isOtpDelivered = updateFlagForOtpDeliveredShipments(trackArr, otp);
    const response = {
      track_arr: trackArr,
      is_otp_delivered: isOtpDelivered,
      longitude: long,
      latitude: lat,
    };
    if (otp) {
      response.latest_otp = otp;
    }
    return response;
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
const updateDataInPullDBAndReports = async (updatedObj, awb, colInstance, courier) => {
  try {
    if (!awb || !updatedObj) {
      return {};
    }
    const filter = { tracking_id: awb };
    if (courier) {
      filter.courier_parent_name = courier;
    }
    const updatedTrackDocument = await colInstance.findOneAndUpdate(
      filter,
      { $set: updatedObj },
      {
        returnNewDocument: true,
        returnDocument: "after",
        upsert: process.env.NODE_ENV === "staging",
        sort: { _id: -1 },
      }
    );

    await updateStatusOnReport(updatedTrackDocument, logger, null, null, null);

    return {};
  } catch (error) {
    logger.error(`failed Updating Data error: ${error.stack} ${error}`);
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
      const couriers = TOPIC_NAME_TO_COURIER_NAME_MAPPER[courierName];
      const redisKey = `${res.awb}_${couriers[0]}`;
      res.couriers = couriers;
      res.redis_key = redisKey;

      // handel special case for Ekart to store Lat-Long and also checking if the data comming from push flow only

      // handel special case for Ekart to store Lat-Long and also checking if the data comming from push flow only

      if (courierName === "ekart" && res.track_info === "delivery_attempt_metadata") {
        if (res.latitude !== "" && res.longitude !== "") {
          try {
            updateEkartLatLong(res);
          } catch (error) {
            logger.error(`updateEkartLatLong failed error: ${error.stack} ${error}`);
          }
        } else {
          logger.error(`Empty Lat-Long Filed, TrackingID: ${res.awb}`);
        }

        return {};
      }

      const processCount = await getTrackingIdProcessingCount({ key: redisKey });

      // await new Promise((done) => setTimeout(() => done(), processCount * 1000));

      await updateTrackingProcessingCount({ key: redisKey });

      const trackData = await redisCheckAndReturnTrackData(res, isFromPulled);
      if (!trackData) {
        logger.info(`data already exists or not found in DB! ${res.awb}`);
        updateTrackingProcessingCount({ awb: res.awb }, "remove");

        const colInstance = await commonTrackingInfoCol();
        try {
          let otpObj = {};
          if (!courierName.includes("pull")) {
            if (res.otp || res.otp_remarks) {
              // Otp Data Backfilling when kafka_pull is updating first
              // Otp Data is only recieved in kafka_Push events

              otpObj = await updateFieldsForDuplicateEvent(res);
            }
          }
          let trackArrObj = {};
          if (courierName.includes("pull") && res.scan_type === "DL") {
            const { latitude, longtitude } = res;
            if (latitude || longtitude) {
              // backfilling  lat and long from pull and updating the trackarray

              trackArrObj = await updateFieldsForDuplicateEvent(res);
            }
          }
          const updatedObj = { ...otpObj, ...trackArrObj };
          await updateDataInPullDBAndReports(updatedObj, res.awb, colInstance, couriers[0]);
        } catch (error) {
          return {};
        }

        // All Updates happening here in single go

        return {};
      }
      let qcDetails = null;
      if (courierName === "shadowfax_pull" && isFromPulled) {
        qcDetails = res?.qc_details;
      }
      trackData.redis_key = redisKey;
      const updatedTrackData = await updatePrepareDict(trackData);
      if (_.isEmpty(updatedTrackData)) {
        logger.error("Xpresbees reverse map not found", trackData);
        updateTrackingProcessingCount({ key: redisKey }, "remove");
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
      result.redis_key = redisKey;
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
      logger.error(`KafkaMessageHandler ${error.stack} ${error}`);
      return {};
    }
  }
}

module.exports = KafkaMessageHandler;

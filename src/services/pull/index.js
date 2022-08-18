/* eslint-disable no-restricted-syntax */
const moment = require("moment");
const _ = require("lodash");

// const { update } = require("lodash");

const { storeDataInCache, updateCacheTrackArray, softCancellationCheck } = require("./services");
const { prepareTrackDataToUpdateInPullDb } = require("./preparator");
const commonTrackingInfoCol = require("./model");
const { updateTrackingProcessingCount } = require("../common/services");
const {
  checkTriggerForPulledEvent,
  updateFlagForOtpDeliveredShipments,
  updateScanStatus,
  checkIsAfter,
  findLastPrePickupTime,
} = require("./helpers");
const { EddPrepareHelper } = require("../common/eddHelpers");
const { PP_PROXY_LIST } = require("../v1/constants");
const { HOST_NAMES } = require("../../utils/constants");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**
 *
 * Updates Audit Logs in track_audit collection in pullMongoDB
 */
const fetchAndUpdateAuditLogsData = async ({
  courierTrackingId,
  updatedObj,
  isFromPulled,
  logger,
}) => {
  try {
    let auditStagingColInstance;
    if (process.env.NODE_ENV === "staging") {
      auditStagingColInstance = await commonTrackingInfoCol({
        hostName: HOST_NAMES.PULL_STATING_DB,
        collectionName: process.env.MONGO_DB_STAGING_AUDIT_COLLECTION_NAME,
      });
    }
    const auditProdColInstance = await commonTrackingInfoCol({
      collectionName: process.env.MONGO_DB_PROD_SERVER_AUDIT_COLLECTION_NAME,
    });

    const auditInstance =
      process.env.NODE_ENV === "staging" ? auditStagingColInstance : auditProdColInstance;

    const queryObj = { courier_tracking_id: courierTrackingId };
    const auditKeyTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const auditObjKey = `${updatedObj["status.current_status_type"]}_${auditKeyTime}`;
    const auditObjValue = {
      source: isFromPulled ? "kafka_consumer_pull" : "kafka_consumer",
      scantime: updatedObj["status.current_status_time"],
      pulled_at: moment().toDate(),
    };
    await auditInstance.findOneAndUpdate(
      queryObj,
      {
        $set: { [`audit.${auditObjKey}`]: auditObjValue },
      },
      { upsert: true }
    );
  } catch (error) {
    logger.error(
      `Updating Audit Logs Failed for trackingId  --> ${courierTrackingId} for status ${updatedObj["status.current_status_type"]} at scanTime ${updatedObj["status.current_status_time"]}`
    );
  }
};

/**
 *
 * @param {*} trackObj
 * @desc sending tracking data to pull mongodb
 * @returns success or error
 */
const updateTrackDataToPullMongo = async ({
  trackObj,
  logger,
  isFromPulled = false,
  qcDetails = null,
}) => {
  const result = prepareTrackDataToUpdateInPullDb(trackObj, isFromPulled);
  if (!result.success) {
    throw new Error(result.err);
  }
  const latestCourierEDD = result?.eddStamp;

  const statusType = result?.statusMap["status.current_status_type"];

  const updatedObj = {
    ...result.statusMap,
    track_arr: [result.eventObj],
    last_update_from: isFromPulled ? "kafka_pull" : "kafka",
    edd_stamp: result.eddStamp ? result.eddStamp : "",
    updated_at: moment().toDate(),
  };
  if (!updatedObj.edd_stamp) {
    delete updatedObj.edd_stamp;
  }
  if (result.eventObj?.otp) {
    updatedObj.latest_otp = result.eventObj.otp;
  }
  try {
    const pullProdCollectionInstance = await commonTrackingInfoCol();

    let pullStagingCollectionInstance;

    if (process.env.NODE_ENV === "staging") {
      pullStagingCollectionInstance = await commonTrackingInfoCol({
        hostName: HOST_NAMES.PULL_STATING_DB,
      });
    }
    const trackArr = updatedObj.track_arr;

    delete updatedObj.track_arr;

    let sortedTrackArray;

    const res = await pullProdCollectionInstance.findOne({ tracking_id: result.awb });

    if (res.is_manual_update) {
      return false;
    }
    const zone = res?.billing_zone;
    const eddStampInDb = res?.edd_stamp;
    if (isFromPulled) {
      const isAllow = checkTriggerForPulledEvent(trackObj, res);
      if (!isAllow) {
        logger.info(
          `trigger returned false for - ${result.awb} and status - ${updatedObj["status.current_status_type"]}`
        );
        return false;
      }
    }
    if (!res) {
      sortedTrackArray = [...trackArr];
    } else {
      // Handle duplicate Entry

      if (isFromPulled) {
        for (const trackItem of res.track_arr) {
          const isSameScanType = updatedObj["status.current_status_type"] === trackItem.scan_type;
          const scanTimeCheck = moment(trackItem.scan_datetime).diff(
            moment(updatedObj["status.current_status_time"]),
            "seconds"
          );

          // const absoluteTimeCheck = Math.abs(scanTimeCheck);

          if (isSameScanType && scanTimeCheck <= 60) {
            logger.info(
              `event discarded for tracking id --> ${result.awb}, status --> ${trackItem?.scan_type}`
            );
            return false;
          }
        }
      }

      let updatedTrackArray = [...trackArr, ...res.track_arr];
      updatedTrackArray = _.orderBy(updatedTrackArray, ["scan_datetime"], ["desc"]);
      sortedTrackArray = updatedTrackArray;
    }
    updatedObj.track_arr = sortedTrackArray;
    updatedObj.courier_edd = latestCourierEDD;

    let pickupDateTime = null;
    if (res?.pickup_datetime && statusType !== "PP") {
      pickupDateTime = res?.pickup_datetime;
    } else {
      const lastPrePickupTime = findLastPrePickupTime(sortedTrackArray);
      sortedTrackArray.forEach((trackEvent) => {
        const isAfter = checkIsAfter(trackEvent?.scan_datetime, lastPrePickupTime);
        if (PP_PROXY_LIST.includes(trackEvent?.scan_type) && isAfter) {
          pickupDateTime = trackEvent?.scan_datetime;
        }
      });
      updatedObj.pickup_datetime = pickupDateTime;
    }

    if (softCancellationCheck(sortedTrackArray, trackObj)) {
      return false;
    }
    const firstTrackObjOfTrackArr = sortedTrackArray[0];
    const thresholdDate = "2022-07-20";
    const isValid = moment(res?.order_created_at).isValid();
    if (
      isValid &&
      moment(res?.order_created_at).isBefore(moment(thresholdDate)) &&
      firstTrackObjOfTrackArr?.scan_type === "LT"
    ) {
      firstTrackObjOfTrackArr.scan_type = "OT";
      firstTrackObjOfTrackArr.scan_status =
        PICKRR_STATUS_CODE_MAPPING[firstTrackObjOfTrackArr.scan_type];
    }

    // Otp Delivered Shipments marking

    if (firstTrackObjOfTrackArr?.scan_type === "DL") {
      const isOtpDelivered = updateFlagForOtpDeliveredShipments(sortedTrackArray);
      updatedObj.is_otp_delivered = isOtpDelivered;
      updateScanStatus(res, sortedTrackArray, isOtpDelivered);
    }
    const promiseEdd = res?.promise_edd;
    if (!promiseEdd && latestCourierEDD) {
      updatedObj.promise_edd = latestCourierEDD;
    }

    // Pickrr EDD is fetch over here

    try {
      const instance = new EddPrepareHelper({ latestCourierEDD, pickupDateTime, eddStampInDb });
      const pickrrEDD = await instance.callPickrrEDDEventFunc({
        zone,
        latestCourierEDD,
        pickupDateTime,
        eddStampInDb,
        statusType,
      });

      // in case of QCF, edd_stamp will be what was calculated before QC Failure

      if (pickrrEDD) {
        updatedObj.edd_stamp = pickrrEDD;
      }
    } catch (error) {
      logger.error(error.message);
    }
    updatedObj["status.current_status_type"] = firstTrackObjOfTrackArr.scan_type;
    updatedObj["status.courier_status_code"] = firstTrackObjOfTrackArr.courier_status_code;
    updatedObj["status.current_status_body"] = firstTrackObjOfTrackArr.scan_status;
    updatedObj["status.current_status_location"] = firstTrackObjOfTrackArr.scan_location;
    updatedObj["status.current_status_time"] = firstTrackObjOfTrackArr.scan_datetime;
    updatedObj["status.pickrr_sub_status_code"] = firstTrackObjOfTrackArr.pickrr_sub_status_code;

    if (["NDR", "UD"].includes(firstTrackObjOfTrackArr.scan_type)) {
      updatedObj.is_ndr = true;
    }
    if (res?.is_reverse_qc) {
      if (qcDetails && isFromPulled) {
        updatedObj.qc_details = qcDetails;
      }
    }
    const pullInstance =
      process.env.NODE_ENV === "staging"
        ? pullStagingCollectionInstance
        : pullProdCollectionInstance;

    const response = await pullInstance.findOneAndUpdate(
      { tracking_id: trackObj.awb },
      {
        $set: updatedObj,
      },
      {
        returnNewDocument: true,
        returnDocument: "after",
        upsert: process.env.NODE_ENV === "staging",
      }
    );

    // audit Logs is Updated Over here

    await fetchAndUpdateAuditLogsData({ courierTrackingId: trackObj.awb, updatedObj });
    await storeDataInCache(result);
    await updateTrackingProcessingCount(trackObj, "remove");
    updateCacheTrackArray({
      currentTrackObj: trackArr[0],
      trackArray: response.value.track_arr,
      awb: result.awb,
      trackingDocument: response.value,
    });
    return response.value;
  } catch (error) {
    logger.error("updateTrackDataToPullMongo Error", error);
    return false;
  }
};

module.exports = {
  updateTrackDataToPullMongo,
};

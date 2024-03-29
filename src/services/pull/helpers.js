/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
const moment = require("moment");
const _ = require("lodash");

const logger = require("../../../logger");
const { TRACKING_PAGE_OTP_MESSAGE } = require("../common/constants");
const { PRE_PICKUP_STATUS } = require("./constants");
const commonTrackingInfoCol = require("./model");
const { HOST_NAMES } = require("../../utils/constants");

/**
 *
 * returning event dict from status obj,
 * which is coming from prepared data (pickrr object)
 */
const mapStatusToEvent = (statusObj) => {
  const eventObj = {
    scan_datetime: statusObj["status.current_status_time"] || "",
    scan_type: statusObj["status.current_status_type"] || "",
    scan_status: statusObj["status.current_status_body"] || "",
    scan_location: statusObj["status.current_status_location"] || "",
  };

  return eventObj;
};

/** */
const updateScanStatus = (document, sortedTrackArray, isOtpDelivered) => {
  try {
    if (!(document?.courier_used || "").includes("delhivery") && isOtpDelivered) {
      sortedTrackArray[0].scan_status += `${TRACKING_PAGE_OTP_MESSAGE}`;
    }
  } catch (error) {
    logger.error("Failed Updating Scan Status for Otp Shipments", error);
  }
};

/**
 *
 * @param {*} trackArr
 * @desc
 * @returns {*}
 */
const prepareTrackArrCacheData = (trackArr) => {
  let isNDR = false;
  const trackMap = trackArr.reduce((obj, item) => {
    const unixScanTime = moment(item.scan_datetime).unix();
    const scanType = item.scan_type;
    if (["NDR", "UD"].includes(scanType)) {
      isNDR = true;
    }
    return {
      ...obj,
      [`${scanType}_${unixScanTime}`]: true,
    };
  }, {});
  return { trackMap, isNDR };
};

/**
 *
 * @param {*} trackArr -> DB track_arr
 * @desc check whether OC status present in track array
 * @returns
 */
const checkCancelStatusInTrackArr = (trackArr) => {
  try {
    const isMatched = trackArr.find((trackObj) => trackObj.scan_type === "OC");

    return !!isMatched;
  } catch (error) {
    logger.error("checkCancelStatusInTrackArr", error);
    return false;
  }
};

/**
 *
 * @param {Event's TrackArr} trackArr
 * returns the last PrePickupTime
 */
const findLastPrePickupTime = (trackArr) => {
  let lastPrePickupTime;
  const n = trackArr.length;
  for (let i = n - 1; i >= 0; i -= 1) {
    if (PRE_PICKUP_STATUS.includes(trackArr[i]?.scan_type)) {
      lastPrePickupTime = moment(trackArr[i]?.scan_datetime).isValid()
        ? trackArr[i]?.scan_datetime
        : null;
    }
  }
  return lastPrePickupTime;
};

/**
 * @desc update cache track_model, if key exists
 */
const updateTrackModel = (cacheTrakModel, trackingDocument) => {
  try {
    return Object.keys(cacheTrakModel).reduce((obj, key) => {
      if (key === "track_arr") {
        obj[key] = cacheTrakModel[key];
      } else {
        obj[key] = trackingDocument[key];
      }
      return obj;
    }, {});
  } catch (error) {
    logger.error(`updateTrackModel ${error.stack} ${error}`);
    return cacheTrakModel;
  }
};

/**
 *
 * @param {*} preparedDict
 * @param {*} dbResponse
 * @desc https://drive.google.com/file/d/1U-Kh18Yfj1-iJDD9Rd8d887PxM7hZ8AK/view?usp=sharing
 */
const checkTriggerForPulledEvent = (preparedDict, dbResponse) => {
  const currentStatus = dbResponse?.status;
  const latestCurrentStatusTimeInDB = currentStatus?.current_status_time;

  // const latestCurrentStatusTimeInDB = _.get(dbResponse, ".current_status_time");

  logger.info(`Check Trigger For Pulled Event t_id: ${preparedDict?.awb}-> ${latestCurrentStatusTimeInDB}`);
  const pulledCurrentStatusTime = _.get(preparedDict, "scan_datetime");

  const currentStatusTypeInDB = _.get(dbResponse, "track_arr[0].scan_type");
  const pulledCurrentStatusType = _.get(preparedDict, "scan_type");

  // need confirmation if we have to remove if block from #133

  if (!["DL", "RTO", "RTD", "PP"].includes(preparedDict.scan_type)) {
    if (moment(latestCurrentStatusTimeInDB).isAfter(moment(pulledCurrentStatusTime))) {
      return false;
    }
    if (
      currentStatusTypeInDB === "DL" &&
      !["RTO", "RTO-OO", "RTO-OT", "RTD"].includes(pulledCurrentStatusType)
    ) {
      if (moment(pulledCurrentStatusType).isAfter(moment(latestCurrentStatusTimeInDB)))
        return false;
    }
  }

  // this condition is when -->
  // current obj time is after latest in DB and latest_scan_type_db = DL and current obj scan --> PP

  if (
    moment(pulledCurrentStatusTime).isAfter(moment(latestCurrentStatusTimeInDB)) &&
    currentStatusTypeInDB === "DL" &&
    pulledCurrentStatusType === "PP"
  ) {
    return false;
  }

  return true;
};

/**
 *
 *Finds Otp Flag in Track Arrays for Delivered Shipment
 *
 */
const updateFlagForOtpDeliveredShipments = (trackArr, latestOtp) => {
  let isOtpDelivered;
  try {
    if (!trackArr[0]?.scan_type === "DL") {
      return isOtpDelivered;
    }
    isOtpDelivered = false;
    trackArr.forEach((eachTrackObj) => {
      if (eachTrackObj?.otp_remarks || eachTrackObj?.otp || latestOtp) {
        isOtpDelivered = true;
      }
    });
    return isOtpDelivered;
  } catch (error) {
    return isOtpDelivered;
  }
};

/**
 *
 * @param {iterable event statusDate} statusDate
 * @param {reference Date} refDate
 * @returns is Valid Event
 */
const checkIsAfter = (statusDate, refDate) => {
  try {
    if (!moment(refDate).isValid()) {
      return true;
    }
    const isValid = moment(statusDate).isValid()
      ? moment(statusDate).isSameOrAfter(moment(refDate))
      : false;
    return isValid;
  } catch (error) {
    return false;
  }
};

/**
 *
 * @desc update freshdesk webhook data in pull mongodb
 * @returns null
 */
const updateFreshdeskWebhookToMongo = async ({ courierTrackingId, statusType }) => {
  try {
    let freshdeskWebhookColInstance;
    if (process.env.NODE_ENV === "staging") {
      freshdeskWebhookColInstance = await commonTrackingInfoCol({
        hostName: HOST_NAMES.PULL_STATING_DB,
        collectionName: process.env.FRESHDESK_WEBHOOK_TRACKING_COLLECTION_NAME,
      });
    } else {
      freshdeskWebhookColInstance = await commonTrackingInfoCol({
        collectionName: process.env.FRESHDESK_WEBHOOK_TRACKING_COLLECTION_NAME,
      });
    }

    const queryObj = {
      $and: [{ tracking_id: courierTrackingId }, { is_updated: false }],
    };
    const response = await freshdeskWebhookColInstance.findOneAndUpdate(
      queryObj,
      {
        $set: {
          is_updated: statusType === "Delivered" || statusType === "RTD",
          status_sent: statusType,
          updated_at: moment().toDate(),
        },
      },
      { upsert: false }
    );
    return response?.value?.ticket_id;
  } catch (error) {
    logger.error(
      `Updating Freshdesk Webhook Mongo Operation Failed for trackingId  --> ${courierTrackingId} for status ${statusType}`
    );
    return null;
  }
};

module.exports = {
  mapStatusToEvent,
  checkIsAfter,
  updateScanStatus,
  prepareTrackArrCacheData,
  checkCancelStatusInTrackArr,
  updateTrackModel,
  checkTriggerForPulledEvent,
  updateFlagForOtpDeliveredShipments,
  findLastPrePickupTime,
  updateFreshdeskWebhookToMongo,
};

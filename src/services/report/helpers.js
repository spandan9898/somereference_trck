const _ = require("lodash");

const logger = require("../../../logger");
const { sendDataToElk } = require("../common/elk");
const { NEW_STATUS_TO_OLD_MAPPING, VALID_FAD_NDR_SUBSTATUS_CODE } = require("./constants");
const { REPORT_STATUS_CODE_MAPPING, REPORT_STATUS_TYPE_MAPPING } = require("./constants");

/**
 *
 * @param {*} trackArr
 * @returns
 */
const findLatestTrackingInfo = (trackDict) => {
  if (!trackDict) {
    return "";
  }
  const latestTrackingInfo = _.get(trackDict, "track_arr[0].scan_status", "");
  return latestTrackingInfo;
};

/**
 *
 * @param {Complete TrackObj for trackingID in PULLDB} trackDict
 * @returns
 */
const findFirstNdrDate = (trackDict) => {
  if (!trackDict) {
    return "";
  }
  const trackArr = _.get(trackDict, "track_arr");
  let firstNdrDate;
  trackArr.forEach((trackArrObj) => {
    if (trackArrObj.scan_type === "NDR") {
      firstNdrDate = trackArrObj.scan_datetime;
    }
  });
  return firstNdrDate;
};

/**
 *
 * @param {*} trackDict
 * @returns
 */
const findLatestLocation = (trackDict) => {
  if (!trackDict) {
    return "";
  }
  const latestLocation = _.get(trackDict, "track_arr[0].scan_location", "");
  return latestLocation;
};

/**
 *
 * @param {*} trackDict
 */
const findLatestStatusDatetime = (trackDict) => {
  if (!trackDict) {
    return "NA";
  }
  const latestDatetime = _.get(trackDict, "track_arr[0].scan_datetime", null);
  if (!latestDatetime) {
    return "NA";
  }
  return latestDatetime;
};

/**
 *
 * @param {*} trackArr
 */
const findFirstAttemptedDate = (trackArr) => {
  let firstAttemptDate = null;
  trackArr.forEach(({ scan_type: scanType, scan_datetime: scanDateTime }) => {
    if (
      ["OO", "DL"].includes(scanType) ||
      (["NDR"].includes(scanType) &&
        VALID_FAD_NDR_SUBSTATUS_CODE.includes(trackArr?.pickrr_sub_status_code || ""))
    ) {
      firstAttemptDate = scanDateTime;
    }
  });
  return firstAttemptDate;
};

/**
 *
 * @param {trackArr in Pull Db} trackArr
 * @param {LatesStatus in Pull Db after Event Update} latestStatus
 * @returns Lost Date if current status is LT, else returns null
 */
const findLostDate = (trackArr, latestStatus) => {
  if (latestStatus === "LT") {
    return trackArr[0]?.scan_datetime || "";
  }
  return null;
};

/**
 *
 * @param {*} trackArr
 */
const findLatestNDRDetails = (trackArr) => {
  for (let i = 0; i < trackArr.length; i += 1) {
    if (trackArr[i].scan_type === "NDR") {
      return {
        latest_ndr_remark: trackArr[i].scan_status,
        latest_ndr_date: trackArr[i].scan_datetime,
      };
    }
  }
  return {
    latest_ndr_remark: null,
    latest_ndr_date: null,
  };
};

/**
 *
 * @param {*} trackArr
 * @returns
 */
const findDeliveryDate = (trackArr) => {
  for (let i = 0; i < trackArr.length; i += 1) {
    if (trackArr[i].scan_type === "DL") {
      return trackArr[i].scan_datetime;
    }
  }
  return null;
};

/**
 *
 * @param {*} trackArr
 * @returns
 */
const findRTODate = (trackArr) => {
  for (let i = 0; i < trackArr.length; i += 1) {
    if (trackArr[i].scan_type === "RTO") {
      return trackArr[i].scan_datetime;
    }
  }
  return null;
};

/**
 *
 * @param {*} statusDict
 */
const prepareTrackingStatus = (trackDict) => {
  const trackingStatus = {
    status_location: "",
    status_code: "",
    status_type: "",
    status_datetime: "",
    status: "",
  };
  if (!trackDict) {
    return trackingStatus;
  }
  const trackInfo = findLatestTrackingInfo(trackDict);
  const location = findLatestLocation(trackDict);
  const latestScanType = _.get(trackDict, "track_arr[0].scan_type", "");
  if (!latestScanType) {
    return trackingStatus;
  }

  //   const latestStatusDatetime = findLatestStatusDatetime(trackDict?.track_arr || {});

  trackingStatus.status_location = location;
  trackingStatus.status_code = REPORT_STATUS_CODE_MAPPING[latestScanType] || latestScanType;

  const newStatusMap = NEW_STATUS_TO_OLD_MAPPING[latestScanType] || latestScanType;
  trackingStatus.status_type = REPORT_STATUS_TYPE_MAPPING[newStatusMap] || newStatusMap;

  trackingStatus.status_datetime = findLatestStatusDatetime(trackDict);
  if (latestScanType === "RTD") {
    trackingStatus.status = " Returned to Source Customer";
  } else {
    trackingStatus.status = trackInfo;
  }
  return trackingStatus;
};

/**
 * @desc send report data to elk for future reference
 */
const sendReportsDataToELK = async (data, elkClient) => {
  try {
    const awb = data.pickrr_tracking_id || "NA";
    const body = {
      awb: awb.toString(),
      payload: JSON.stringify(data),
      time: new Date(),
    };
    await sendDataToElk({
      body,
      elkClient,
      indexName: process.env.NODE_ENV === "production" ? "track-reports" : "track-reports-dev",
    });
  } catch (error) {
    logger.error("sendReportsDataToELK", { data });
  }
};

module.exports = {
  prepareTrackingStatus,
  findLatestTrackingInfo,
  findLatestLocation,
  findFirstAttemptedDate,
  findLatestNDRDetails,
  findDeliveryDate,
  findRTODate,
  sendReportsDataToELK,
  findFirstNdrDate,
  findLostDate,
};

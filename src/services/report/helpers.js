const moment = require("moment");
const _ = require("lodash");
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
  const convertedDatetime = moment(latestDatetime).add(330, "minute").format("DD MMM YYYY HH:mm");
  return convertedDatetime;
};

/**
 *
 * @param {*} trackArr
 */
const findFirstAttemptedDate = (trackArr) => {
  let firstAttemptDate = null;
  for (let i = 0; i < trackArr.length; i += 1) {
    if (trackArr[i].scan_type === "NDR") {
      firstAttemptDate = trackArr[i].scan_datetime;
    }
  }
  return firstAttemptDate;
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
    latest_ndr_remark: "",
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
  trackingStatus.status_code = REPORT_STATUS_CODE_MAPPING[latestScanType];
  trackingStatus.status_type = REPORT_STATUS_TYPE_MAPPING[latestScanType];
  trackingStatus.status_datetime = findLatestStatusDatetime(trackDict?.track_arr || {});
  if (latestScanType === "RTD") {
    trackingStatus.status = " Returned to Source Customer";
  } else {
    trackingStatus.status = trackInfo;
  }
  return trackingStatus;
};

module.exports = {
  prepareTrackingStatus,
  findLatestTrackingInfo,
  findLatestLocation,
  findFirstAttemptedDate,
  findLatestNDRDetails,
  findDeliveryDate,
  findRTODate,
};

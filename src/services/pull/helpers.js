const moment = require("moment");
const logger = require("../../../logger");

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

module.exports = {
  mapStatusToEvent,
  prepareTrackArrCacheData,
  checkCancelStatusInTrackArr,
};

const moment = require("moment");

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

module.exports = {
  mapStatusToEvent,
  prepareTrackArrCacheData,
};

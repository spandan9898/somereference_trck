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
const prepareTrackArrCacheData = (trackArr) =>
  trackArr.reduce((obj, item) => {
    const unixScanTime = moment(item.scan_datetime).unix();
    return {
      ...obj,
      [`${item.scan_type}_${unixScanTime}`]: item,
    };
  }, {});

module.exports = {
  mapStatusToEvent,
  prepareTrackArrCacheData,
};

const moment = require("moment");
const { getObject } = require("./redis");

/**
 *
 * @param {*} trackObj
 * @desc Check awb in cache with below conditions
 * Check if awb not in redis then go forward -> return false i.e move forward
 * if exists then check ->
 *      NST < OST -> return true,  i.e data exists , stop process here
 *      NST - OST < 1 minute and type is same -> return false, i.e same as above
 * Otherwise -> return false i.e move foward
 * @returns true or false
 */
const checkAwbInCache = async (trackObj) => {
  const getCacheData = await getObject(trackObj.awb);

  if (!getCacheData) {
    return false;
  }

  const oldScanDateTime = moment(getCacheData.scan_datetime, "DD-MM-YYYY HH:MM");
  const newScanDateTime = moment(trackObj.scan_datetime, "DD-MM-YYYY HH:MM");
  const oldScanType = getCacheData.scan_type;
  const newScanType = trackObj.scan_type;

  if (newScanDateTime.isBefore(newScanDateTime)) {
    return true;
  }

  const diff = newScanDateTime.diff(oldScanDateTime, "minute");
  if (diff < 1 && oldScanType === newScanType) {
    return true;
  }
  return false;
};

module.exports = {
  checkAwbInCache,
};

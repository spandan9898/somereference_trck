const logger = require("../../../logger");
const { getObject, setObject } = require("../../utils/redis");

/**
 *
 * @param {*} track_arr
 */
const findPickupDate = (trackArr) => {
  // eslint-disable-next-line consistent-return
  trackArr.forEach((trackArrObj) => {
    if (trackArrObj?.scan_type === "PP") {
      return trackArrObj.scan_datetime;
    }
  });
  return "";
};

/**
 *
 * @param {*} track_arr
 */
const ofdCount = (trackArr) => {
  // eslint-disable-next-line consistent-return
  let ofdCountNum = 0;
  trackArr.forEach((trackArrObj) => {
    if (trackArrObj?.scan_type === "OO") {
      ofdCountNum += 1;
    }
  });
  return ofdCountNum;
};

/**
 * @desc if current status is in UD & NDR then trigger
 *    if not then check isNDR true from cache. if it is true we need to send all status to NDR
 */
const checkIfTriggerNDREb = async (currentStatusType, awb) => {
  try {
    if (!awb) {
      return false;
    }
    const { isNDR = false } = (await getObject(awb)) || {};

    if (["NDR", "UD"].includes(currentStatusType) || isNDR) {
      return true;
    }
    return false;
  } catch (error) {
    logger.error("checkNdrEBTrigger", error);
    return false;
  }
};

/**
 *
 * @param {*} awb
 * @desc update isNDR to true when NDR/UD status type found in track_arr or in current status
 */
const updateIsNDRinCache = async (awb) => {
  try {
    const cacheData = await getObject(awb);
    cacheData.isNDR = true;
    await setObject(awb, cacheData);
  } catch (error) {
    logger.error("updateIsNDRinCache", error);
  }
};

module.exports = {
  findPickupDate,
  ofdCount,
  checkIfTriggerNDREb,
  updateIsNDRinCache,
};

const logger = require("../../../logger");
const { getObject, setObject } = require("../../utils/redis");
const { PP_PROXY_LIST } = require("../v1/constants");

/**
 *
 * @param {*} trackData
 */
const findPickupDate = (trackData, updateObj) => {
  if (!trackData.pickup_datetime || updateObj?.status?.current_status_type === "PP") {
    if (PP_PROXY_LIST.includes(updateObj?.status?.current_status_type)) {
      return updateObj?.status?.current_status_time;
    }
  }
  return "";
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
    const cacheData = (await getObject(awb)) || {};
    cacheData.isNDR = true;
    await setObject(awb, cacheData);
  } catch (error) {
    logger.error("updateIsNDRinCache", error);
  }
};

module.exports = {
  findPickupDate,
  checkIfTriggerNDREb,
  updateIsNDRinCache,
};

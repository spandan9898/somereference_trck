const logger = require("../../../logger");
const { getObject, storeInCache } = require("../../utils/redis");
const { PP_PROXY_LIST } = require("../v1/constants");

/**
 *
 * @param {*} trackData
 */
const findPickupDate = (trackData) => {
  if (trackData?.pickup_datetime) {
    return trackData?.pickup_datetime;
  }

  let pickupDatetime = "";
  const trackArr = trackData?.track_arr || [];
  for (let i = 0; i < trackArr.length; i += 1) {
    if (PP_PROXY_LIST.includes(trackArr[i]?.scan_type)) {
      pickupDatetime = trackArr[i]?.scan_datetime;
    }
  }
  return pickupDatetime;
};

/**
 * @desc if current status is in UD & NDR then trigger
 *    if not then check isNDR true from cache. if it is true we need to send all status to NDR
 */
const checkIfTriggerNDREb = async (currentStatusType, redisKey) => {
  try {
    if (!redisKey) {
      return false;
    }
    const { is_ndr: isNDR = false } = (await getObject(redisKey)) || {};

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
const updateIsNDRinCache = async (key) => {
  try {
    const cacheData = (await getObject(key)) || {};
    cacheData.is_ndr = true;
    await storeInCache(key, cacheData);
  } catch (error) {
    logger.error(`updateIsNDRinCache ${error.stack} ${error}`);
  }
};

module.exports = {
  findPickupDate,
  checkIfTriggerNDREb,
  updateIsNDRinCache,
};

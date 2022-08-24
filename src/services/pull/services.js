/* eslint-disable no-param-reassign */
const _ = require("lodash");
const moment = require("moment");

const logger = require("../../../logger");
const { setObject, storeInCache, getObject, checkAwbInCache } = require("../../utils");
const {
  prepareTrackDataForTracking,
  fetchTrackingModelAndUpdateCache,
} = require("../common/trackServices");
const { updateIsNDRinCache } = require("../ndr/helpers");
const { checkCancelStatusInTrackArr, updateTrackModel } = require("./helpers");

/**
 *
 * @param {*} currentTrackObj -> recent pushed prepared track obj
 * @param {*} trackArray -> whole trak array (same as DB)
 * @desc -> if track_arr not found in cache then use trackArray otherwise use currentTrackObj
 * and update cache's track_arr
 * @returns bool
 */
const updateCacheTrackArray = async ({ trackArray, awb, trackingDocument }) => {
  try {
    const cacheData = await getObject(awb);

    if (_.isEmpty(cacheData)) {
      await fetchTrackingModelAndUpdateCache(awb);
      return true;
    }
    const trackModel = cacheData.track_model;

    if (_.isEmpty(trackModel)) {
      await fetchTrackingModelAndUpdateCache(awb);
      return true;
    }

    const preparedTrackArray = prepareTrackDataForTracking(trackArray);
    cacheData.track_model.track_arr = preparedTrackArray;
    if (trackingDocument) {
      const updatedTrackModel = updateTrackModel(cacheData.track_model, trackingDocument);
      cacheData.track_model = updatedTrackModel;
    }
    await storeInCache(awb, cacheData);
    return true;
  } catch (error) {
    logger.error("updateCacheTrackArray", error);
    return false;
  }
};

/** *
 * @param preparedTrackData -> 
 * {
    awb: '75456956632',
    scan_type: 'PPF',
    scan_datetime: '17-06-2019 18:06',
    track_info: 'PICKUP CANCELLED; QUALITY CHECK FAILED',
    track_location: 'MANALI SERVICE CENTRE',
    received_by: '',
    pickup_datetime: '17-06-2019 08:00',
    EDD: '30-12-2021',
    pickrr_status: 'Pickup Failed',
    pickrr_sub_status_code: 'REJ',
    courier_status_code: '016-S'
  }
 * 
  * @desc check in cache and if exists then return false otherwise return tracking object, which will be move forward
 * @returns {string}
 */
const redisCheckAndReturnTrackData = async (preparedTrackData, isFromPulled) => {
  const trackObj = { ...preparedTrackData };
  const isExists = await checkAwbInCache({ trackObj, updateCacheTrackArray, isFromPulled });
  if (isExists) {
    return false;
  }
  return trackObj;
};

/**
 *
 * @param {*} result: prepared data
 * @desc store data in cache with expected format
 */
const storeDataInCache = async (result) => {
  const { eventObj, awb } = result;
  const { scan_datetime: scanDatetime } = eventObj || {};
  const redisKey = `${eventObj.scan_type}_${moment(scanDatetime).unix()}`;
  const newRedisPayload = {
    [redisKey]: true,
  };
  if (["NDR", "UD"].includes(eventObj.scan_type)) {
    await updateIsNDRinCache(awb);
  }
  const dt = (await getObject(awb)) || {};
  const oldData = { ...dt, ...newRedisPayload };
  await setObject(awb, oldData);
};

/**
 *
 * @param {*} trackArr -> updated track_arr (after fetching from DB)
 * @param {*} preparedTrackData
 * @desc check OC status in track_arr. If present and current pushed status
 * is in ["OFP", "OM", "OP", "PPF", "OC"] then break the process otherwise continue
 * @returns true/false
 */
const softCancellationCheck = (trackArr, preparedTrackData) => {
  try {
    const isPresent = checkCancelStatusInTrackArr(trackArr);
    if (!isPresent) {
      return false;
    }
    const currentStatus = preparedTrackData.scan_type;

    if (["OFP", "OM", "OP", "PPF", "OC"].includes(currentStatus)) {
      return true;
    }

    return false;
  } catch (error) {
    logger.error("softCancellationCheck", error);
    return false;
  }
};

module.exports = {
  redisCheckAndReturnTrackData,
  storeDataInCache,
  updateCacheTrackArray,
  softCancellationCheck,
};

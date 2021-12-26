const _ = require("lodash");
const moment = require("moment");

const logger = require("../../../logger");
const { setObject, getObject, checkAwbInCache } = require("../../utils");
const { sortStatusArray, fetchTrackingModelAndUpdateCache } = require("../common");
const { prepareTrackDataForTracking } = require("../common");

/**
 *
 * @param {*} currentTrackObj -> recent pushed prepared track obj
 * @param {*} trackArray -> whole trak array (same as DB)
 * @desc -> if track_arr not found in cache then use trackArray otherwise use currentTrackObj
 * and update cache's track_arr
 * @returns bool
 */
const updateCacheTrackArray = async ({ currentTrackObj, trackArray, awb }) => {
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

    const cachedTrackArray = trackModel.track_arr;

    if (_.isEmpty(cachedTrackArray)) {
      // i.e first time,

      const preparedTrackArray = prepareTrackDataForTracking(trackArray);
      cacheData.trackModel.track_arr = preparedTrackArray;
    } else {
      // i.e track_arr data exists in cache
      // Check the recent status_name, if it is same as current status_name
      // then append currentTrackObj to status_array, and do sorting(scan_datetime)
      // If it's not same then simply prepare new track object and append to top of cached track array.

      const cachedTopTrackObj = cachedTrackArray[0];

      if (_.get(currentTrackObj, "scan_type") === _.get(cachedTopTrackObj, "scan_type")) {
        cachedTopTrackObj.status_array.push(_.omit(currentTrackObj, "scan_type"));
        cachedTopTrackObj.status_array = sortStatusArray(cachedTopTrackObj.status_array);
      } else {
        cachedTrackArray.unshift({
          status_name: currentTrackObj.scan_type,
          status_array: sortStatusArray([_.omit(currentTrackObj, "scan_type")]),
        });
      }
      cacheData.track_model.track_arr = cachedTrackArray;
    }

    await setObject(awb, cacheData);
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
const redisCheckAndReturnTrackData = async (preparedTrackData) => {
  const trackObj = { ...preparedTrackData };

  const isExists = await checkAwbInCache(trackObj, updateCacheTrackArray);
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
  const dt = (await getObject(awb)) || {};
  const oldData = { ...dt, ...newRedisPayload };
  await setObject(awb, oldData);
};

module.exports = {
  redisCheckAndReturnTrackData,
  storeDataInCache,
  updateCacheTrackArray,
};

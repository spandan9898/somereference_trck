/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const moment = require("moment");
const { setObject } = require("./redis");
const { prepareTrackArrCacheData } = require("../services/pull/helpers");
const commonTrackingInfoCol = require("../services/pull/model");

const { getObject } = require("./redis");
const logger = require("../../logger");
const { updateIsNDRinCache } = require("../services/ndr/helpers");

/**
 *
 * @param {*} awb
 * @desc fetch tracking data from pull db, if exists then prepare track data and store in cache
 * PS: it'll call only if cache data not found
 */
const fetchTrackingDataAndStoreInCache = async (trackObj, updateCacheTrackArray) => {
  try {
    const { awb } = trackObj;

    const pullCollection = await commonTrackingInfoCol();
    const response = await pullCollection.findOne(
      { tracking_id: awb },
      { projection: { track_arr: 1 } }
    );

    if (!response) {
      return "NA";
    }

    const cacheData = (await getObject(awb)) || {};
    const { trackMap, isNDR } = prepareTrackArrCacheData(response.track_arr);

    const updatedCacheData = { ...trackMap };
    updatedCacheData.track_model = cacheData.track_model || {};
    await setObject(awb, updatedCacheData);
    await updateCacheTrackArray({
      trackArray: response.track_arr,
      currentTrackObj: trackObj,
      awb,
    });
    if (isNDR) {
      await updateIsNDRinCache(awb);
    }
    return trackMap;
  } catch (error) {
    logger.error("fetchTrackingDataAndStoreInCache", error);
    return false;
  }
};

/**
 *
 * @param {*} newScanTime -> recent scan date time
 * @param {*} cachedData -> old cache data
 * @desc compare old scan date time with new scan date time
 * and return true if exists otherwise return  false
 * @returns true/false
 */
const compareScanUnixTimeAndCheckIfExists = (newScanTime, newScanType, cachedData) => {
  const cacheKeys = Object.keys(cachedData);
  return cacheKeys.some((key) => {
    const keys = key.split("_");
    if (keys[0] === newScanType) {
      let oldScanTime = +keys[1];
      oldScanTime += 330 * 60;
      const diff = (newScanTime - oldScanTime) / 60;
      return diff >= -1 && diff <= 1;
    }
  });
};

/**
 *
 * @param {*} trackObj
 * @param {*} cachedData
 * @returns
 */
const checkCurrentStatusAWBInCache = (trackObj, cachedData) => {
  const cacheKeys = Object.keys(cachedData);
  const currentStatusType = trackObj?.status?.current_status_type || trackObj?.scan_type;

  for (let i = 0; i < cacheKeys.length; i += 1) {
    const keys = cacheKeys[i].split("_");
    let statusInitial = keys[0];
    statusInitial = statusInitial.toLowerCase();
    if (
      ["dl", "rtd"].includes(statusInitial) ||
      (statusInitial === "rto" && currentStatusType === "RTO") ||
      (statusInitial === "rto" && currentStatusType !== "RTD")
    ) {
      return true;
    }
  }
  return false;
};

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
const checkAwbInCache = async (trackObj, updateCacheTrackArray) => {
  const cachedData = await getObject(trackObj.awb);
  const newScanTime = moment(trackObj.scan_datetime).unix();

  if (!cachedData) {
    const res = await fetchTrackingDataAndStoreInCache(trackObj, updateCacheTrackArray);
    if (!res) {
      return false;
    }
    if (res === "NA") {
      return true;
    }
    if (checkCurrentStatusAWBInCache(trackObj, res)) return true;
    const isExists = await compareScanUnixTimeAndCheckIfExists(
      newScanTime,
      trackObj.scan_type,
      res
    );
    return isExists;
  }
  if (checkCurrentStatusAWBInCache(trackObj, cachedData)) return true;

  const isExists = await compareScanUnixTimeAndCheckIfExists(
    newScanTime,
    trackObj.scan_type,
    cachedData
  );
  return isExists;
};

/**
 *
 * @param {*} date
 * @returns
 */
const convertDatetimeFormat = (date) =>
  date ? moment(date, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY HH:mm") : "";

/**
 *
 * @param {*} date
 * @returns
 */
const convertDatetimeFormat2 = (date) =>
  date ? moment.utc(date, "YYYY-MM-DD HH:mm:ss").format("DD MMM YYYY, HH:mm") : "";

module.exports = {
  checkAwbInCache,
  convertDatetimeFormat,
  convertDatetimeFormat2,
};

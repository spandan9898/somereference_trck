/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const moment = require("moment");
const axios = require("axios");
const size = require("lodash/size");

const { setObject } = require("./redis");
const { prepareTrackArrCacheData } = require("../services/pull/helpers");
const commonTrackingInfoCol = require("../services/pull/model");

const { getObject } = require("./redis");
const logger = require("../../logger");
const { updateIsNDRinCache } = require("../services/ndr/helpers");
const { DEFAULT_REQUESTS_TIMEOUT, ELK_INSTANCE_NAMES } = require("./constants");
const initELK = require("../connector/elkConnection");

const axiosInstance = axios.create();

/**
 *
 * @param {*} awb
 * @desc fetch tracking data from pull db, if exists then prepare track data and store in cache
 * PS: it'll call only if cache data not found
 */
const fetchTrackingDataAndStoreInCache = async (trackObj, updateCacheTrackArray) => {
  try {
    const { awb } = trackObj || {};

    const pullCollection = await commonTrackingInfoCol();
    const response = await pullCollection.findOne(
      { tracking_id: awb },
      { projection: { track_arr: 1 } }
    );

    if (!response) {
      return "NA";
    }

    const cacheData = (await getObject(awb)) || {};
    const { trackMap, isNdr } = prepareTrackArrCacheData(response.track_arr);
    let { is_ndr: isNDR } = response;

    isNDR = isNDR || isNdr;

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
const checkAwbInCache = async ({ trackObj, updateCacheTrackArray, isFromPulled }) => {
  const cachedData = await getObject(trackObj.awb);
  const newScanTime = moment(trackObj.scan_datetime).unix();

  if (!cachedData || !(size(cachedData) >= 2)) {
    const res = await fetchTrackingDataAndStoreInCache(trackObj, updateCacheTrackArray);
    if (!res) {
      return false;
    }
    if (res === "NA") {
      return true;
    }

    const isExists = await compareScanUnixTimeAndCheckIfExists(
      newScanTime,
      trackObj.scan_type,
      res
    );

    if (isExists) {
      return true;
    }
    if (checkCurrentStatusAWBInCache(trackObj, res) && !isFromPulled) return true;

    return isExists;
  }
  const isExists = await compareScanUnixTimeAndCheckIfExists(
    newScanTime,
    trackObj.scan_type,
    cachedData
  );

  if (isExists) {
    return true;
  }
  if (checkCurrentStatusAWBInCache(trackObj, cachedData) && !isFromPulled) return true;

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

/**
 * @desc central api call
 */
class MakeAPICall {
  constructor(url, payload, headers, params, timeout) {
    axiosInstance.defaults.timeout = (timeout || DEFAULT_REQUESTS_TIMEOUT) * 1000; // support milliseconds
    this.url = url;
    this.payload = payload;
    this.headers = headers || { "content-type": "application/json" };
    this.params = params;
    this.axios = axiosInstance;
  }

  getConfig(otherConfigs) {
    const config = {
      headers: this.headers,
      params: this.params,
      ...otherConfigs,
    };
    return config;
  }

  async get(otherConfigs) {
    try {
      const config = this.getConfig(otherConfigs);
      const { data, status, headers } = await this.axios.get(this.url, config);
      return {
        data,
        statusCode: status,
        headers,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async put(otherConfigs) {
    try {
      const config = this.getConfig(otherConfigs);
      const { data, status, headers } = await this.axios.put(this.url, this.payload, config);
      return {
        data,
        statusCode: status,
        headers,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async post(otherConfigs) {
    try {
      const config = this.getConfig(otherConfigs);
      const { data, status, headers } = await this.axios.post(this.url, this.payload, config);
      return {
        data,
        statusCode: status,
        headers,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

/**
 *
 * validates if the expected dateobj is instance of datetime
 * @returns True
 */
const validateDateField = (dateObj) => moment(dateObj).isValid();

/**
 *
 * @param {datetime Object field} dateObj1
 * @param {datetime Object field} dateObj2
 * @returns Minimum of Two Dates
 */
const getMinDate = (dateObj1, dateObj2) =>
  moment(dateObj1).isBefore(dateObj2) ? moment(dateObj1).toDate() : moment(dateObj2).toDate();

/**
 *
 * @param {datetime Object field} dateObj1
 * @param {datetime Object field} dateObj2
 * @returns maximum of Two Dates
 */
const getMaxDate = (dateObj1, dateObj2) =>
  moment(dateObj1).isAfter(dateObj2) ? moment(dateObj1).toDate() : moment(dateObj2).toDate();

/**
 *
 * @desc get all ELK instances
 */
const getElkClients = () => {
  let prodElkClient = "";
  const stagingElkClient = "";
  let trackingElkClient = "";
  try {
    prodElkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.PROD.name);

    // stagingElkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.STAGING.name);

    trackingElkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.TRACKING.name);

    return {
      prodElkClient,
      stagingElkClient,
      trackingElkClient,
    };
  } catch (error) {
    logger.error("getElkClients", error);
    return {
      prodElkClient,
      stagingElkClient,
    };
  }
};

/**
 *
 * @param {*} track_arr
 */
const ofdCount = (trackArr, scanType) => {
  let ofdCountNum = 0;
  let ndrCountNum = 0;

  trackArr.forEach((trackArrObj) => {
    if (trackArrObj?.scan_type === "OO") {
      ofdCountNum += 1;
    } else if (trackArrObj?.scan_type === "NDR") {
      ndrCountNum += 1;
    }
  });
  let finalOfdCount = 0;
  if (["UD", "NDR", "DL", "RTO", "RTO-OO", "RTO UD", "RTD", "OO"].includes(scanType)) {
    finalOfdCount = Math.max(1, ofdCountNum, ndrCountNum);
  } else finalOfdCount = ofdCountNum;

  return finalOfdCount;
};

/**
 *
 * @param {*} scanType
 */
const mapReverseScanType = (scanType) => {
  let mappedScanType = "";
  if (scanType === "DL") {
    mappedScanType = "RTD";
  } else if (scanType === "OO") {
    mappedScanType = "RTO-OO";
  } else {
    mappedScanType = "RTO-OT";
  }
  return mappedScanType;
};
module.exports = {
  checkAwbInCache,
  convertDatetimeFormat,
  convertDatetimeFormat2,
  MakeAPICall,
  validateDateField,
  getMinDate,
  getMaxDate,
  getElkClients,
  ofdCount,
  mapReverseScanType,
};

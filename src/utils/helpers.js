/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const moment = require("moment");
const axios = require("axios");
const size = require("lodash/size");
const isEmpty = require("lodash/isEmpty");
const sgMail = require("@sendgrid/mail");

const { storeInCache } = require("./redis");
const { prepareTrackArrCacheData } = require("../services/pull/helpers");
const commonTrackingInfoCol = require("../services/pull/model");

const { getObject } = require("./redis");
const logger = require("../../logger");
const { updateIsNDRinCache } = require("../services/ndr/helpers");
const { DEFAULT_REQUESTS_TIMEOUT, ELK_INSTANCE_NAMES } = require("./constants");
const initELK = require("../connector/elkConnection");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    if (!response.track_arr) {
      logger.info(`response.track_arr is empty in fetchTrackingDataAndStoreInCache for awb: ${awb}`, error);
      return "NA";
    }

    const cacheData = (await getObject(awb)) || {};
    const { trackMap, isNdr } = prepareTrackArrCacheData(response.track_arr);
    let { is_ndr: isNDR } = response;

    isNDR = isNDR || isNdr;

    const updatedCacheData = { ...trackMap };
    updatedCacheData.track_model = cacheData.track_model || {};
    await storeInCache(awb, updatedCacheData);
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
    logger.error(`fetchTrackingDataAndStoreInCache for awb: ${awb}`, error);
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
 * @param {*} trackingObj -> latest document to be send on common topic
 * @desc check if latest event sent on common kafka topic is same as
 * current status
 * @returns true/false
 */
const isLatestEventSentOnCommonTopic = async (trackingObj) => {
  try {
    const currentStatusTime = trackingObj?.status?.current_status_time;
    const currentStatusType = trackingObj?.status?.current_status_type;
    const awb = trackingObj?.courier_tracking_id;
    if (!currentStatusTime || !currentStatusType || !awb) {
      return false;
    }
    const cacheData = (await getObject(awb)) || {};
    const latestEventSent = cacheData?.latest_event_sent_on_common_topic;
    const newScanTime = moment(currentStatusTime).unix();
    let keys = null;
    if (latestEventSent) {
      keys = latestEventSent.split("_");
    }
    if (keys && keys[0] === currentStatusType) {
      const oldScanTime = keys[1];
      const diff = (newScanTime - oldScanTime) / 60;
      if (diff >= -1 && diff <= 1) {
        logger.info(
          `Event discarded on tracking_topic for awb: ${awb}, status: ${currentStatusType}, scan_time: ${currentStatusTime}`
        );
        return true;
      }
    }
    cacheData.latest_event_sent_on_common_topic = `${currentStatusType}_${newScanTime}`;
    await storeInCache(awb, cacheData);
    logger.info(
      `Event sent on tracking_topic for awb: ${awb}, status: ${currentStatusType}, scan_time: ${currentStatusTime}`
    );
    return false;
  } catch (error) {
    logger.error("Error in checking isLatestEventSentOnCommonTopic", error);
    return false;
  }
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

  if (!cachedData || !(size(cachedData) >= 2) || !cachedData?.track_model) {
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
const ofdCount = (trackArr) => {
  let ofdCountNum = 0;
  let dlCountNum = 0;
  let currentOOTimestamp = null;
  let currentDLTimestamp = null;
  for (let i = 0; i < trackArr.length; i += 1) {
    if (trackArr[i]?.scan_type === "OO") {
      if (!currentOOTimestamp) {
        currentOOTimestamp = moment(trackArr[i]?.scan_datetime);
        ofdCountNum += 1;
      } else if (currentOOTimestamp.diff(moment(trackArr[i]?.scan_datetime), "minutes") > 60) {
        currentOOTimestamp = moment(trackArr[i]?.scan_datetime);
        ofdCountNum += 1;
      }
    }
    if (trackArr[i]?.scan_type === "DL") {
      if (!currentDLTimestamp) {
        currentDLTimestamp = moment(trackArr[i]?.scan_datetime);
        dlCountNum += 1;
      } else if (currentDLTimestamp.diff(moment(trackArr[i]?.scan_datetime), "minutes") > 60) {
        currentDLTimestamp = moment(trackArr[i]?.scan_datetime);
        dlCountNum += 1;
      }
    }
  }
  return ofdCountNum || Math.min(1, dlCountNum);
};

/**
 * @param {[string]} emailList
 * @param {string} type
 */
const prepareEmailList = (emailList, type = "cc") =>
  isEmpty(emailList)
    ? []
    : {
        [type]: emailList.map((email) => ({
          email,
        })),
      };

/**
 * @desc send mail
 * @msgData {object} ->{
 *  to: string or [string] ->
 *  from: string ->
 *  subject: string ->
 *  text: string ->
 *  html?: string ->
 *  cc?: [string] ->
 *  bcc?: [string] ->
 * }
 */
const sendEmail = async ({
  to,
  from = "info@pickrr.com",
  subject,
  text,
  html,
  ccList,
  bccList,
}) => {
  const toEmailList = typeof to === "string" ? [to] : to;

  const personalizations = [
    {
      ...prepareEmailList(toEmailList, "to"),
      ...prepareEmailList(ccList),
      ...prepareEmailList(bccList, "bcc"),
    },
  ];

  const msg = {
    from,
    subject,
    text,
    html,
    personalizations,
  };

  try {
    await sgMail.send(msg);
    logger.info("Email Sent");
  } catch (error) {
    logger.error("sendEmail", error);
  }
};

/**
 * 
 * @param {*} s -> accept a string 
 * @desc convert a special string realted to Reason DEscription object
 * @returns Its return the JSON Object
 * result body (input string)
 * "{id=101165.0, reasonId=101165.0, reasonCode=291, reasonDescription=Pickup not ready (Packaging * not ready, manifest not ready)}"

 * return body type of result
 * {
 *   id: '101165.0',
 *   reasonId: '101165.0',
 *   reasonCode: '291',
 *   reasonDescription: 'Pickup not ready (Packaging not ready, manifest not ready)'
 * }

 * example function call : 
 * stringToJSON("{id=101165.0, reasonId=101165.0, reasonCode=291 reasonDescription=Pickup not ready (Packaging not ready, manifest not ready)}");
 */
const parseReasonDescription = (s) => {
  let tmp = "";
  const arr = [];

  // const flag = 0;

  let specialFlagforReasonDescription = false;
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === "=" || s[i] === ":") {
      tmp = tmp.toLowerCase();
      if (tmp === "reasondescription") {
        specialFlagforReasonDescription = true;
      } else {
        specialFlagforReasonDescription = false;
      }
      let p = "";

      i += 1;
      while (specialFlagforReasonDescription === false) {
        if (s[i] === "," || s[i] === "}") {
          break;
        }
        p += s[i];
        i += 1;
      }
      let count = 0;
      while (specialFlagforReasonDescription === true) {
        if (s[i] === ",") {
          count += 1;
        }
        if (count === 2) {
          break;
        }
        if (s[i] === "}") {
          break;
        }
        p += s[i];
        i += 1;
      }
      const pair = [];
      pair.push(tmp);
      pair.push(p);
      arr.push(pair);
      tmp = "";
    } else if ((s[i] >= "a" && s[i] <= "z") || (s[i] >= "A" && s[i] <= "Z")) {
      tmp += s[i];
    }
  }

  const result = {};

  // converting 2D array to JSON OBJECT

  for (let i = 0; i < arr.length; i += 1) {
    result[arr[i][0]] = arr[i][1];
  }

  // console.log(result);

  return result;
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
  parseReasonDescription,
  sendEmail,
  isLatestEventSentOnCommonTopic,
};

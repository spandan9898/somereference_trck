/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const _ = require("lodash");
const { getString, setString } = require("../../utils/redis");
const logger = require("../../../logger");
const { VALIDATE_VIA_AUTH_TOKEN, ALLOWED_IPS } = require("../../utils/constants");
const { filterTrackingObj } = require("./preparator");
const { fetchTrackingModelAndUpdateCache } = require("../../services/common/trackServices");
const { fetchTrackingIdFromClientOrderId } = require("./models");

/**
 * fetches tracking response from cache if present, else fetches from db-> stores
 *  in cache and returns
 * @param {*} trackingIds
 * @param {*} clientOrderIds
 * @param {*} authToken
 * @param {*} ip
 */
const fetchTrackingService = async (trackingIds, clientOrderIds, authToken = null, IP = null) => {
  let responseDict = {};
  const responseList = [];
  try {
    const ValidateViaAuthToken = VALIDATE_VIA_AUTH_TOKEN;
    let allowFetchFromDB = false;
    if (ValidateViaAuthToken) {
      if (authToken) {
        allowFetchFromDB = true;
      }
    }
    let trackingIdsList = [];
    if (clientOrderIds) {
      const clientOrderIdsList = clientOrderIds.replaceAll(" ", "").split(",");

      if (clientOrderIdsList.length > 30) {
        responseDict.err = "cannot track more than 30 clientOrderIds at once";
        return responseDict;
      }
      for (let i = 0; i < clientOrderIdsList.length; i += 1) {
        const clientOrderIdPattern = clientOrderIdsList[i];
        const clientOrderId = clientOrderIdPattern.split("-PICK-")[0];
        const userPK = Number(clientOrderIdPattern.split("-PICK-")[1]);
        const cachedAwb = (await getString(clientOrderIdPattern)) || {};
        const clientOrderIdPatternExistInCache = !_.isEmpty(cachedAwb);

        if (clientOrderIdPatternExistInCache) {
          trackingIdsList.push(cachedAwb);
        } else {
          try {
            const res = await fetchTrackingIdFromClientOrderId(clientOrderId, userPK);
            const resExists = !_.isEmpty(res);
            if (resExists) {
              const awb = res?.tracking_id || "";
              await setString(clientOrderIdPattern, awb);
              trackingIdsList.push(awb);
            } else {
              trackingIdsList.push("err");
            }
          } catch (error) {
            trackingIdsList.push("err");
          }
        }
      }
    } else if (trackingIds) {
      trackingIdsList = trackingIds.replaceAll(" ", "").split(",");
    } else {
      return responseDict;
    }
    if (trackingIdsList.length > 30) {
      responseDict.err = "cannot track more than 30 waybills at once";
      return responseDict;
    }
    if (trackingIdsList.length === 1) {
      try {
        if (trackingIdsList[0] === "err") {
          // client order id not found

          responseDict.response_list = responseList;
          return responseDict;
        }
        const trackingObj = await fetchTrackingModelAndUpdateCache(trackingIdsList[0]);
        const cacheAuthToken = trackingObj?.track_model?.auth_token || "";
        if (cacheAuthToken !== authToken) {
          if (IP && ALLOWED_IPS.includes(IP)) {
            // pass
          } else {
            responseDict.err = "Unauthorized";
            return responseDict;
          }
        }
        responseDict = trackingObj?.track_model || {};
        return responseDict;
      } catch (error) {
        responseDict.err = " Tracking id Not found";
      }
      if ((IP && ALLOWED_IPS.includes(IP)) || allowFetchFromDB) {
        const trackingObj = await fetchTrackingModelAndUpdateCache(trackingIdsList[0]);
        const trackModel = await filterTrackingObj(trackingObj?.track_model);
        responseDict = trackModel;
        return responseDict;
      }
      responseDict.err = "Tracking id Not Found";
      return responseDict;
    }
    let singleResponseDict = {};
    for (let i = 0; i < trackingIdsList.length; i += 1) {
      const trackingId = trackingIdsList[i];
      if (trackingId === "err") {
        // client order id not found

        responseList.push({ err: "order id not found" });
        continue;
      }
      if (!trackingId) {
        continue;
      }
      try {
        const trackingObj = await fetchTrackingModelAndUpdateCache(trackingId);
        const cacheAuthToken = trackingObj?.track_model?.auth_token || "";
        if (cacheAuthToken !== authToken) {
          if (IP && ALLOWED_IPS.includes(IP)) {
            // pass
          } else {
            responseDict.err = "Unauthorized";
            return responseDict;
          }
        }
        singleResponseDict = trackingObj?.track_model;
        responseList.push(singleResponseDict);
      } catch (error) {
        singleResponseDict = {};
        singleResponseDict.err = "Tracking Id Not Found";
        responseList.push(singleResponseDict);
      }
      responseDict.response_list = responseList;
    }
    return responseDict;
  } catch (error) {
    if (error.message.includes("failed")) {
      responseDict.err = "Tracking ID not found";
    }
    logger.error(error.message);
    return responseDict;
  }
};

module.exports = { fetchTrackingService };

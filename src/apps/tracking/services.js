/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const _ = require("lodash");
const RequestIp = require("@supercharge/request-ip");
const { getString, setString } = require("../../utils/redis");
const logger = require("../../../logger");
const { VALIDATE_VIA_AUTH_TOKEN, ALLOWED_IPS, BLOCKED_IPS } = require("../../utils/constants");
const { filterTrackingObj, prepareConcatenatedTrackingIdList } = require("./preparator");
const { fetchTrackingModelAndUpdateCache } = require("../../services/common/trackServices");
const { fetchTrackingIdFromClientOrderId } = require("./models");

/**
 * fetches tracking response from cache if present, else fetches from db-> stores
 *  in cache and returns
 * @param {*} trackingIds
 * @param {*} authToken
 * @param {*} ip
 */
const fetchTrackingService = async ({ trackingIdsList, authToken = null, IP = null }) => {
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
    if (_.isEmpty(trackingIdsList)) return responseDict;
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
        if (trackingIdsList[0] === "err_auth") {
          responseDict.response_list = responseList;
          return responseDict;
        }
        const trackingObj = await fetchTrackingModelAndUpdateCache(trackingIdsList[0], true);
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
        responseDict.err = " Tracking ID not found";
      }
      if ((IP && ALLOWED_IPS.includes(IP)) || allowFetchFromDB) {
        const trackingObj = await fetchTrackingModelAndUpdateCache(trackingIdsList[0], true);
        const trackModel = await filterTrackingObj(trackingObj?.track_model);
        responseDict = trackModel;
        return responseDict;
      }
      responseDict.err = "Tracking ID not found";
      return responseDict;
    }
    let singleResponseDict = {};
    for (let i = 0; i < trackingIdsList.length; i += 1) {
      const trackingId = trackingIdsList[i];
      if (trackingId === "err") {
        // client order id not found

        responseList.push({ err: "Order ID not found" });
        continue;
      } else if (trackingId === "err_auth") {
        responseList.push({ err: "authentication error" });
        continue;
      }
      if (!trackingId) {
        continue;
      }
      try {
        const trackingObj = await fetchTrackingModelAndUpdateCache(trackingId, true);
        const cacheAuthToken = trackingObj?.track_model?.auth_token || "";
        if (cacheAuthToken !== authToken) {
          if (IP && ALLOWED_IPS.includes(IP)) {
            // pass
          } else {
            responseList.push({ err: "Unauthorized" });
            continue;
          }
        }
        singleResponseDict = trackingObj?.track_model;
        responseList.push(singleResponseDict);
      } catch (error) {
        singleResponseDict = {};
        singleResponseDict.err = "Tracking ID Not Found";
        singleResponseDict.tracking_id = trackingId;
        responseList.push(singleResponseDict);
      }
    }
    responseDict.response_list = responseList;
    return responseDict;
  } catch (error) {
    if (error.message.includes("failed")) {
      responseDict.err = "Tracking ID not found";
    } else {
      logger.error(error.message);
    }
    return responseDict;
  }
};

/**
 * Authentication for client and public tracking API
 * @param {*} req
 * @returns
 */
const TrackingAuthenticationService = async (req) => {
  let trackingIds = null;
  let clientOrderIds = null;
  const authToken = req.query?.auth_token || null;
  let IP = RequestIp.getClientIp(req);
  const hostName = req?.headers?.origin || "";
  let verifiedByHost = true;
  let valid = true;
  if (BLOCKED_IPS.includes(IP)) {
    return { status: "" };
  }
  if (hostName.toLowerCase().includes("pickrr.com")) {
    verifiedByHost = true;
  }
  const { query } = req;
  if (query.tracking_id) {
    trackingIds = query.tracking_id
      .replace("\n", "")
      .replace("\t", "")
      .replace("\r", "")
      .replace(" ", "");
  } else if (query.client_order_id) {
    clientOrderIds = query.client_order_id
      .replaceAll(" ", "")
      .replace("\n", "")
      .replace("\t", "")
      .replace("\r", "")
      .replace(" ", "");
  } else {
    return { err: "invalid request" };
  }
  if (!authToken) {
    valid = false;
  }
  if (IP && ALLOWED_IPS.includes(IP)) {
    valid = true;
  }
  if (verifiedByHost) {
    valid = true;
    [IP] = ALLOWED_IPS;
  }
  if (!valid) {
    return { err: "Invalid Request/ Unauthorized" };
  }

  return { trackingIds, clientOrderIds, authToken, IP };
};

/**
 * fetche TrackingId From ClientOrderId and authtoken and stores it in cache
 * @param {*} clientOrderIds
 * @param {*} authToken
 */
const getTrackingIdFromClientOrderIdClientTrackingService = async (clientOrderIds, authToken) => {
  const clientOrderIdsList = clientOrderIds.replaceAll(" ", "").split(",");
  const trackingIdsList = [];
  try {
    for (const clientOrderId of clientOrderIdsList) {
      let clientOrderIdPattern = "";

      if (clientOrderId.includes("-PICK-")) {
        clientOrderIdPattern = clientOrderId;
        const splitList = clientOrderId.split("-PICK-");
        const clientOrderIdNew = splitList[0];

        const cachedAwbs = (await getString(clientOrderIdPattern)) || {};
        let cachedAwbsList = [];
        if (!_.isEmpty(cachedAwbs)) {
          cachedAwbsList = cachedAwbs.split(",");
          trackingIdsList.push(...cachedAwbsList);
        } else {
          try {
            const listDocs = await fetchTrackingIdFromClientOrderId({
              clientOrderId: clientOrderIdNew,
              authToken,
            });
            if (!_.isEmpty(listDocs)) {
              const concatenatedTrackingIds = await prepareConcatenatedTrackingIdList({
                listDocs,
                trackingIdsList,
              });
              await setString(clientOrderIdPattern, concatenatedTrackingIds);
            } else {
              trackingIdsList.push("err");
            }
          } catch (error) {
            trackingIdsList.push("err");
          }
        }
      } else if (authToken) {
        clientOrderIdPattern = `${clientOrderId}-PICK-${authToken}`;
        const cachedAwbs = (await getString(clientOrderIdPattern)) || {};
        let cachedAwbsList = [];
        if (!_.isEmpty(cachedAwbs)) {
          cachedAwbsList = cachedAwbs.split(",");
          trackingIdsList.push(...cachedAwbsList);
        } else {
          try {
            const listDocs = await fetchTrackingIdFromClientOrderId({ clientOrderId, authToken });
            if (!_.isEmpty(listDocs)) {
              const concatenatedTrackingIds = await prepareConcatenatedTrackingIdList({
                listDocs,
                trackingIdsList,
              });
              await setString(clientOrderIdPattern, concatenatedTrackingIds);
            } else {
              trackingIdsList.push("err");
            }
          } catch (error) {
            trackingIdsList.push("err");
          }
        }
      } else {
        trackingIdsList.push("err_auth");
      }
    }

    return trackingIdsList;
  } catch (error) {
    logger.error("getTrackingIdFromClientOrderIdClientTrackingServiceError---->", error);
    return trackingIdsList;
  }
};

/**
 *
 * @param {*} clientOrderIds
 * @param {*} authToken
 */
const getTrackingIdFromClientOrderIdPublicTrackingService = async (clientOrderIds) => {
  const clientOrderIdsList = clientOrderIds.replaceAll(" ", "").split(",");
  const trackingIdsList = [];
  try {
    for (const clientOrderIdPattern of clientOrderIdsList) {
      if (clientOrderIdPattern.includes("-PICK-")) {
        const clientOrderId = clientOrderIdPattern.split("-PICK-")[0];
        const userPK = Number(clientOrderIdPattern.split("-PICK-")[1]);
        const cachedAwbs = (await getString(clientOrderIdPattern)) || {};
        let cachedAwbsList = [];
        if (!_.isEmpty(cachedAwbs)) {
          cachedAwbsList = cachedAwbs.split(",");
          trackingIdsList.push(...cachedAwbsList);
        } else {
          try {
            const listDocs = await fetchTrackingIdFromClientOrderId({
              clientOrderId,
              userPK,
            });
            if (!_.isEmpty(listDocs)) {
              const concatenatedTrackingIds = await prepareConcatenatedTrackingIdList({
                listDocs,
                trackingIdsList,
              });
              await setString(clientOrderIdPattern, concatenatedTrackingIds);
            } else {
              trackingIdsList.push("err");
            }
          } catch (error) {
            trackingIdsList.push("err");
          }
        }
      }
    }
    return trackingIdsList;
  } catch (error) {
    logger.error("getTrackingIdFromClientOrderIdPublicTracking---->", error);
    return trackingIdsList;
  }
};

/**
 *
 * @param {*} req
 */
const authenticateUpdateClientOrderIdInCache = async (req) => {
  try {
    const authToken = req.query?.auth_token;
    const { query } = req;
    const clientOrderIdsList = query.client_order_id
      .replaceAll(" ", "")
      .replace("\n", "")
      .replace("\t", "")
      .replace("\r", "")
      .replace(" ", "")
      .split(",");
    const userPK = query?.user_pk;
    return { clientOrderIdsList, authToken, userPK };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *
 * @param {*} clientOrderIdsList
 * @param {*} authToken
 */
const updateClientOrderIdPatternInCacheService = async ({
  clientOrderIdsList,
  authToken,
  userPK,
}) => {
  try {
    for (const clientOrderId of clientOrderIdsList) {
      const trackingIdsList = [];
      let clientOrderIdPattern = "";
      if (authToken) {
        clientOrderIdPattern = `${clientOrderId}-PICK-${authToken}`;
      } else {
        clientOrderIdPattern = `${clientOrderId}-PICK-${userPK}`;
      }
      let listDocs = [];
      if (authToken) {
        listDocs = await fetchTrackingIdFromClientOrderId({
          clientOrderId,
          authToken,
        });
      } else if (userPK) {
        listDocs = await fetchTrackingIdFromClientOrderId({
          clientOrderId,
          userPK,
        });
      }
      if (!_.isEmpty(listDocs)) {
        const concatenatedTrackingIds = await prepareConcatenatedTrackingIdList({
          listDocs,
          trackingIdsList,
        });
        await setString(clientOrderIdPattern, concatenatedTrackingIds);
      }
    }
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = {
  fetchTrackingService,
  TrackingAuthenticationService,
  getTrackingIdFromClientOrderIdClientTrackingService,
  getTrackingIdFromClientOrderIdPublicTrackingService,
  updateClientOrderIdPatternInCacheService,
  authenticateUpdateClientOrderIdInCache,
};

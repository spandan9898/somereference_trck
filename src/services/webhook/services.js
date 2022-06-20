/* eslint-disable no-promise-executor-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
const _ = require("lodash");
const { isEmpty, get, last, cloneDeep, omit, first } = require("lodash");
const axios = require("axios");

const logger = require("../../../logger");
const { getObject, getString, storeInCache, getDbCollectionInstance } = require("../../utils");
const { fetchAllEnabledWebhookUserData } = require("./model");
const { sendDataToElk } = require("../common/elk");
const { fetchWebhookHistoryMapData } = require("./model");
const { prepareCurrentStatusWebhookKeyMap } = require("./preparator");
const {
  COMPULSORY_EVENTS,
  COMPULSORY_EVENTS_PRECEDENCE,
  STATUS_PROXY_LIST,
  SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS,
  SMART_SHIP_AUTH_TOKENS,
} = require("./constants");
const {
  WebhookHelper,
  getTrackObjFromTrackArray,
  isWebhookUserDataUpdateable,
} = require("./helpers");
const WebhookClient = require("../../apps/webhookClients");
const { callLambdaFunction } = require("../../connector/lambda");
const { WEBHOOK_USER_CACHE_KEY_NAME } = require("../../utils/constants");

// const { NAAPTOL_AUTH_TOKEN } = require("../../apps/webhookClients/constants");

const {
  SHOPCLUES_TOKEN_URL,
  SHOPCLUES_USERNAME,
  SHOPCLUES_PASSWORD,
  SHOPCLUES_CLIENTID,
  SHOPCLUES_CLIENT_SECRET,
  SHOPCLUES_GRANT_TYPE,
  MONGO_DB_PROD_WEBHOOK_COLLECTION_NAME,
} = process.env;

/**
 * @desc fetch all common webhook user from DB and store in cache
 */
const updateAllEnabledWebhookUserDataInCache = async () => {
  try {
    const res = await fetchAllEnabledWebhookUserData();
    if (isEmpty(res)) {
      logger.error("No Webhook user data found");
      return false;
    }
    const webhookUserCachePayload = res.reduce((obj, webhookUser) => {
      webhookUser.events_enabled = webhookUser.events_enabled || {};
      if (!obj[webhookUser?.user_auth_token]) {
        obj[webhookUser.user_auth_token] = [];
      }
      obj[webhookUser.user_auth_token].push(omit(webhookUser, "user_auth_token"));
      return obj;
    }, {});
    await storeInCache(WEBHOOK_USER_CACHE_KEY_NAME, webhookUserCachePayload);
  } catch (error) {
    logger.error("updateAllEnabledWebhookUserDataInCache", error);
  }
  return true;
};

/**
 *
 * @param {*} authToken
 * @desc fetch webhook user data from cache by auth token,
 *  if not exists then return empty object i.e break the flow.
 * @returns {}
 */
const getWebhookUserDataFromCache = async (authToken) => {
  try {
    if (!authToken) {
      return {};
    }
    const res = (await getObject(WEBHOOK_USER_CACHE_KEY_NAME)) || {};

    if (!res[authToken]) {
      return {};
    }

    return {
      ...res[authToken],
      user_auth_token: authToken,
    };
  } catch (error) {
    logger.error("getWebhookUserDataFromCache", error);
    return {};
  }
};

/**
 *
 * @desc  check webhook enebaled for particular status
 */
const hasCurrentStatusWebhookEnabled = (webhookUserData, currentStatus) => {
  if (!isEmpty(webhookUserData.events_enabled)) {
    if (webhookUserData.events_enabled.includes(currentStatus)) {
      return true;
    }
    return false;
  }
  return true;
};

/**
 *
 * @get Shopclues access token from cache or realtime generation if expired
 */
const getShopCluesAccessToken = async () => {
  try {
    const shopCluesAccessToken = await getString("shopcluesToken");
    if (!shopCluesAccessToken) {
      const ShopCluesPayload = {
        username: SHOPCLUES_USERNAME,
        password: SHOPCLUES_PASSWORD,
        client_id: SHOPCLUES_CLIENTID,
        client_secret: SHOPCLUES_CLIENT_SECRET,
        grant_type: SHOPCLUES_GRANT_TYPE,
      };
      const res = await axios.post(SHOPCLUES_TOKEN_URL, ShopCluesPayload);
      const resData = res.data;
      if ("access_token" in resData) {
        await storeInCache("shopcluesToken", resData.access_token, 60 * 59);
        return resData.access_token;
      }

      return false;
    }
    return shopCluesAccessToken;
  } catch (error) {
    logger.error("getShopCluesAccessToken", error);
    return false;
  }
};

/**
 *
 * @param {*} data -> lambda payload
 * @param {*} elkClient -> elk instance
 * @desc sending lambda payload data to elk instance
 */
const sendWebhookDataToELK = async (data, elkClient) => {
  try {
    const awb = data.tracking_info_doc?.tracking_id || "NA";
    const authToken = data.tracking_info_doc?.auth_token || "naa";
    const body = {
      awb: awb.toString(),
      auth_token: authToken,
      payload: JSON.stringify(data),
      time: new Date(),
    };
    await sendDataToElk({
      indexName: process.env.NODE_ENV === "production" ? "track_webhook" : "track_webhook_dev",
      body,
      elkClient,
    });
  } catch (error) {
    logger.error("sendWebhookDataToELK", error);
  }
};

/**
 * @param {*} trackingObj
 */
const statusCheckInHistoryMap = async (trackingObj) => {
  try {
    const currentStatusType = trackingObj?.status?.current_status_type;
    const currentStatusTime = trackingObj?.status?.current_status_time;
    const trackingId = trackingObj?.tracking_id;
    if (!currentStatusType || !trackingId) {
      return false;
    }
    const res = await fetchWebhookHistoryMapData(trackingId);
    if (!res) {
      return false;
    }
    const { history_map: historyMap } = res || {};
    if (isEmpty(historyMap)) {
      return false;
    }
    const currentStatusWebhookMapKey = prepareCurrentStatusWebhookKeyMap(
      currentStatusType,
      currentStatusTime
    );
    if (get(historyMap, currentStatusWebhookMapKey)) {
      return true;
    }
    return false;
  } catch (error) {
    logger.error("statusCheckInHistoryMap", error);
    return false;
  }
};

/**
 *
 * @param {*} trackingObj
 * @desc check if current status(event) is in mandatory_status_map and already
 * sent trigger
 * @returns true/false
 */
const checkIfCompulsoryEventAlreadySent = (trackingObj) => {
  try {
    const currentEvent = get(trackingObj, "status.current_status_type", "");
    if (!["PP", "RTO", "RTD", "DL", "OO", "SHP", "RAD"].includes(currentEvent)) {
      return false;
    }
    if (currentEvent === "OO") {
      return false;
    }
    const mandatoryStatusMap = get(trackingObj, `mandatory_status_map[${currentEvent}]`);
    return mandatoryStatusMap?.is_sent && mandatoryStatusMap?.is_received_success;
  } catch (error) {
    logger.error("checkIfCompulsoryEventAlreadySent", error);
    return false;
  }
};

/**
 *
 * @desc prepare tracking info document and call webhook lambda
 */
const prepareDataAndCallLambda = async (trackingDocument, elkClient, webhookUserData) => {
  try {
    const trackingObj = _.cloneDeep(trackingDocument);

    const isStatusAlreadyPresentInHistoryMap = await statusCheckInHistoryMap(trackingObj);
    if (isStatusAlreadyPresentInHistoryMap) {
      return false;
    }

    if (checkIfCompulsoryEventAlreadySent(trackingObj)) {
      return false;
    }

    const webhookClient = new WebhookClient(trackingObj);
    const preparedData = await webhookClient.getPreparedData();

    if (_.isEmpty(preparedData)) {
      return false;
    }

    const lambdaPayload = {
      data: {
        tracking_info_doc: _.omit(trackingObj, ["audit", "_id"]),
        prepared_data: preparedData,
        url: "",
        shopclues_access_token: "random_token",
        update_from: "kafka-consumer",
      },
    };
    if (
      [...SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS, ...SMART_SHIP_AUTH_TOKENS].includes(
        trackingObj.auth_token
      )
    ) {
      const shopcluesToken = await getShopCluesAccessToken();
      if (!shopcluesToken) {
        return false;
      }
      lambdaPayload.data.shopclues_access_token = shopcluesToken;
    }

    const currentStatus = trackingObj?.status?.current_status_type;
    for (const eachWebhookUserData of webhookUserData) {
      const statusWebhookEnabled = hasCurrentStatusWebhookEnabled(
        eachWebhookUserData,
        currentStatus
      );

      if (!statusWebhookEnabled) {
        // eslint-disable-next-line no-continue
        continue;
      }
      lambdaPayload.data.url = eachWebhookUserData.url;
      sendWebhookDataToELK(lambdaPayload.data, elkClient);

      // if (
      //   ![
      //     ...NAAPTOL_AUTH_TOKEN,
      //     ...SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS,
      //     ...SMART_SHIP_AUTH_TOKENS,
      //   ].includes(trackingObj?.auth_token)
      // ) {
      //   callLambdaFunction(lambdaPayload);
      //   return false;
      // }

      callLambdaFunction(lambdaPayload);
    }

    return true;
  } catch (error) {
    logger.error("prepareDataAndCallLambda", error);
    return false;
  }
};

/**
 * @desc webhook service for compulsory event check
 */
class WebhookServices extends WebhookHelper {
  constructor(trackingObj, elkClient, webhookUserData) {
    super();
    this.trackingObj = trackingObj;
    this.elkClient = elkClient;
    this.webhookUserData = webhookUserData;
  }

  getProxyEventStatus(trackArray, event) {
    try {
      const trackObj = getTrackObjFromTrackArray(trackArray);
      const eventStatusProxyList = STATUS_PROXY_LIST[event];
      for (const proxyEvent of eventStatusProxyList) {
        let proxyStatus = null;
        if (trackObj[proxyEvent]) {
          if (proxyEvent === "OO") {
            proxyStatus = this.mapEventTotStatus(first(trackObj[proxyEvent]) || []);
          } else {
            proxyStatus = this.mapEventTotStatus(last(trackObj[proxyEvent]) || []);
          }
          proxyStatus.current_status_type = event;
          return proxyStatus;
        }
      }
      return {};
    } catch (error) {
      logger.error("getProxyEventStatus", error);
      return {};
    }
  }

  async handleSingleCompulsoryEvent(event) {
    const trackingObj = cloneDeep(this.trackingObj);
    const trackArray = trackingObj.track_arr || [];
    const mandatoryStatusMap = get(trackingObj, "mandatory_status_map") || {};

    const specialStatus = this.getProxyEventStatus(trackArray, event);

    if (isEmpty(specialStatus)) {
      return {};
    }

    const matchedMandatoryStatusMap = mandatoryStatusMap[specialStatus.current_status_type] || {};
    if (matchedMandatoryStatusMap?.is_sent && matchedMandatoryStatusMap?.is_received_success) {
      return {};
    }

    _.set(trackingObj, "status", specialStatus);

    return trackingObj;
  }

  async compulsoryEventsHandler() {
    try {
      const { status } = this.trackingObj;
      if (!status) {
        return [];
      }
      const currentStatusType = status.current_status_type;
      const flagCheckReqObj = this.prepareInitialFlagCheckReqObj();

      for (const compulsoryEvent in COMPULSORY_EVENTS) {
        if (!COMPULSORY_EVENTS[compulsoryEvent].includes(currentStatusType)) {
          flagCheckReqObj[compulsoryEvent] = true;
        }
      }

      const proxyEventsData = [];

      let breakPrecedenceLoop = false;
      for (let precedence = 0; precedence < COMPULSORY_EVENTS_PRECEDENCE.length; precedence += 1) {
        if (breakPrecedenceLoop) {
          break;
        }
        let foundAnEventForCurrentPrecedence = false;

        for (const event of COMPULSORY_EVENTS_PRECEDENCE[precedence]) {
          if (flagCheckReqObj[event]) {
            foundAnEventForCurrentPrecedence = true;
            const res = await this.handleSingleCompulsoryEvent(event);
            if (!isEmpty(res)) {
              proxyEventsData.push(res);
            }
          }
        }
        if (!foundAnEventForCurrentPrecedence) {
          breakPrecedenceLoop = true;
        }
      }
      return proxyEventsData;
    } catch (error) {
      logger.error("compulsoryEventsHandler", error);
      return [];
    }
  }
}

/**
 *
 * @param {*} updatedDocument -> common webhook user document
 * @desc first check if all required fields are present in updatedDocument
 * if present then we have to update webhookUser cacheData, otherwise some required fields are either false or missing, in this case we have to remove it from webhookUser
 */
const updateWebhookUserCacheData = async (updatedDocument) => {
  try {
    const webhookUserCacheData = (await getObject(WEBHOOK_USER_CACHE_KEY_NAME)) || {};
    const isUpdateAble = isWebhookUserDataUpdateable(updatedDocument);

    if (isUpdateAble) {
      // Update webhook user data with updated one

      webhookUserCacheData[updatedDocument.user_auth_token] = {
        track_url: updatedDocument.track_url,
        token: updatedDocument.token,
        has_webhook_enabled: updatedDocument.has_webhook_enabled,
        shop_platform: updatedDocument.shop_platform,
        events_enabled: updatedDocument.events_enabled || {},
      };
    } else {
      delete webhookUserCacheData[updatedDocument.user_auth_token];
    }

    await storeInCache(WEBHOOK_USER_CACHE_KEY_NAME, webhookUserCacheData);

    logger.info("Webhook user cache update by mongo stream");
  } catch (error) {
    logger.error("updateWebhookUserCacheData from stream", error);
  }
};

/**
 * @desc list all changes on common_webhook_user collection;
 */
const monitorWebhookUserColChanges = async () => {
  try {
    const collection = await getDbCollectionInstance({
      collectionName: MONGO_DB_PROD_WEBHOOK_COLLECTION_NAME,
    });
    const changeStream = collection.watch([], { fullDocument: "updateLookup" });

    changeStream.on("change", (next) => {
      updateWebhookUserCacheData(next.fullDocument);
    });
  } catch (error) {
    logger.error("monitorWebhookUserColChanges error -->", error);
  }
};

module.exports = {
  hasCurrentStatusWebhookEnabled,
  getShopCluesAccessToken,
  sendWebhookDataToELK,
  statusCheckInHistoryMap,
  WebhookServices,
  checkIfCompulsoryEventAlreadySent,
  prepareDataAndCallLambda,
  updateAllEnabledWebhookUserDataInCache,
  getWebhookUserDataFromCache,
  monitorWebhookUserColChanges,
};

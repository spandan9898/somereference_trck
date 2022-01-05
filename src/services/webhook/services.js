/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
const _ = require("lodash");
const { isEmpty, get, last, cloneDeep } = require("lodash");
const axios = require("axios");

const logger = require("../../../logger");
const { getObject, getString, setString, storeInCache } = require("../../utils");
const { commonWebhookUserInfoCol } = require("./model");
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
const { WebhookHelper, getTrackObjFromTrackArray } = require("./helpers");
const WebhookClient = require("../../apps/webhookClients");
const { callLambdaFunction } = require("../../connector/lambda");

const {
  SHOPCLUES_TOKEN_URL,
  SHOPCLUES_USERNAME,
  SHOPCLUES_PASSWORD,
  SHOPCLUES_CLIENTID,
  SHOPCLUES_CLIENT_SECRET,
  SHOPCLUES_GRANT_TYPE,
} = process.env;

/**
 *
 * @desc  check webhook enebaled for particular status
 */
const hasCurrentStatusWebhookEnabled = (cacheObj, currentStatus) => {
  if (!isEmpty(cacheObj.has_webhook_enabled)) {
    if (cacheObj.has_webhook_enabled.includes(currentStatus)) {
      return true;
    }
    return false;
  }
  return true;
};

/**
 *
 * @param trackArr
 * @desc store and fetch data from cache if exists else fetch from db and cache update
 */
const webhookUserHandlingGetAndStoreInCache = async (trackObj) => {
  try {
    const authToken = trackObj?.auth_token;

    if (!authToken) {
      return false;
    }
    const cachedAuthTokenData = await getObject(authToken);

    if (!cachedAuthTokenData) {
      const webhookInstance = await commonWebhookUserInfoCol();
      const res = await webhookInstance.findOne({ user_auth_token: authToken });
      if (res && res.track_url && res.has_webhook_enabled && res.is_active && res.user_auth_token) {
        const cachePayload = {
          user_auth_token: res.user_auth_token,
          track_url: res.track_url,
          token: res?.token,
          has_webhook_enabled: res.has_webhook_enabled,
          shop_platform: res?.shop_platform,
          events_enabled: res?.events_enabled || {},
        };

        await storeInCache(authToken, cachePayload, 60 * 59);
        return {
          success: true,
          cachUserData: cachePayload,
        };
      }
    } else {
      return {
        success: true,
        cachUserData: cachedAuthTokenData,
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    logger.error("webhookUserHandlingGetAndStoreInCache", error);
    return {
      success: false,
    };
  }
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
        await setString("shopcluesToken", resData.access_token);
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
    const body = {
      awb: awb.toString(),
      payload: JSON.stringify(data),
      time: new Date(),
    };
    await sendDataToElk({
      indexName: "track_webhook",
      body,
      elkClient,
    });
  } catch (error) {
    logger.error("sendWebhookDataToELK", error);
  }
};

/**
 *
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
    if (!["PP", "RTO", "RTD", "DL"].includes(currentEvent)) {
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
const prepareDataAndCallLambda = async (trackingObj, elkClient) => {
  try {
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
      },
    };
    const result = await webhookUserHandlingGetAndStoreInCache(trackingObj);
    if (!result.success) {
      return false;
    }

    lambdaPayload.data.url = result.cachUserData.track_url;
    const currentStatus = trackingObj?.status?.current_status_type;

    const statusWebhookEnabled = hasCurrentStatusWebhookEnabled(
      result.cachUserData.has_webhook_enabled,
      currentStatus
    );

    if (!statusWebhookEnabled) {
      return false;
    }

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
    sendWebhookDataToELK(lambdaPayload.data, elkClient);

    await callLambdaFunction(lambdaPayload);

    return true;
  } catch (error) {
    logger.error("prepareDataAndCallLambda", error);
    return false;
  }
};

/**
 *
 */
class WebhookServices extends WebhookHelper {
  constructor(trackingObj, elkClient) {
    super();
    this.trackingObj = trackingObj;
    this.elkClient = elkClient;
  }

  getProxyEventStatus(trackArray, event) {
    try {
      const trackObj = getTrackObjFromTrackArray(trackArray);
      const eventStatusProxyList = STATUS_PROXY_LIST[event];
      for (const proxyEvent of eventStatusProxyList) {
        if (trackObj[proxyEvent]) {
          const proxyStatus = this.mapEventTotStatus(last(trackObj[proxyEvent]) || []);
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

    const specialStatus = this.getProxyEventStatus(trackArray, event);

    if (isEmpty(specialStatus)) {
      return {};
    }

    _.set(trackingObj, "status", specialStatus);
    await prepareDataAndCallLambda(trackingObj, this.elkClient);
    return {};
  }

  compulsoryEventsHandler() {
    try {
      const { status } = this.trackingObj;
      if (!status) {
        return false;
      }
      const currentStatusType = status.current_status_type;
      const flagCheckReqObj = this.prepareInitialFlagCheckReqObj();

      for (const compulsoryEvent in COMPULSORY_EVENTS) {
        if (!COMPULSORY_EVENTS[compulsoryEvent].includes(currentStatusType)) {
          flagCheckReqObj[compulsoryEvent] = true;
        }
      }

      let breakPrecedenceLoop = false;
      for (let precedence = 0; precedence < COMPULSORY_EVENTS_PRECEDENCE.length; precedence += 1) {
        if (breakPrecedenceLoop) {
          break;
        }
        let foundAnEventForCurrentPrecedence = false;

        COMPULSORY_EVENTS_PRECEDENCE[precedence].forEach((event) => {
          if (flagCheckReqObj[event]) {
            foundAnEventForCurrentPrecedence = true;
            this.handleSingleCompulsoryEvent(event);
          }
        });
        if (!foundAnEventForCurrentPrecedence) {
          breakPrecedenceLoop = true;
        }
      }
      return true;
    } catch (error) {
      logger.errpr("compulsoryEventsHandler", error);
      return false;
    }
  }
}

module.exports = {
  hasCurrentStatusWebhookEnabled,
  getShopCluesAccessToken,
  webhookUserHandlingGetAndStoreInCache,
  sendWebhookDataToELK,
  statusCheckInHistoryMap,
  WebhookServices,
  checkIfCompulsoryEventAlreadySent,
  prepareDataAndCallLambda,
};

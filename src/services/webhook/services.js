const { isEmpty, get } = require("lodash");
const axios = require("axios");

const logger = require("../../../logger");
const { getObject, getString, setString, storeInCache } = require("../../utils");
const { commonWebhookUserInfoCol } = require("./model");
const { sendDataToElk } = require("../common/elk");
const { fetchWebhookHistoryMapData } = require("./model");
const { prepareCurrentStatusWebhookKeyMap } = require("./preparator");

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

module.exports = {
  hasCurrentStatusWebhookEnabled,
  getShopCluesAccessToken,
  webhookUserHandlingGetAndStoreInCache,
  sendWebhookDataToELK,
  statusCheckInHistoryMap,
};

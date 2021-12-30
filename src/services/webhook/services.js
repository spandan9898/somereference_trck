const { isEmpty } = require("lodash");
const axios = require("axios");
const logger = require("../../../logger");
const { getObject, getString, setString, storeInCache } = require("../../utils");
const commonWebhookUserInfoCol = require("./model");

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

module.exports = {
  hasCurrentStatusWebhookEnabled,
  getShopCluesAccessToken,
  webhookUserHandlingGetAndStoreInCache,
};

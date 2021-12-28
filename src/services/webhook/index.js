const logger = require("../../../logger");

const {
  webhookUserHandlingGetAndStoreInCache,
  getShopCluesAccessToken,
  hasCurrentStatusWebhookEnabled,
} = require("./services");
const { SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS, SMART_SHIP_AUTH_TOKENS } = require("./constants");

/**
 * webhook trigger
 */
const triggerWebhook = async (trackingObj) => {
  try {
    const lambdaPayload = {
      data: {
        tracking_info_doc: trackingObj,
        url: "",
        shopify_access_token: "",
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
      lambdaPayload.data.shopify_access_token = shopcluesToken;
    }

    // TODO: call lambda function
  } catch (error) {
    logger.error("triggerWebhook", error);
  }
};

module.exports = triggerWebhook;
module.exports = getShopCluesAccessToken;

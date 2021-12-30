const _ = require("lodash");

const logger = require("../../../logger");
const {
  webhookUserHandlingGetAndStoreInCache,
  getShopCluesAccessToken,
  hasCurrentStatusWebhookEnabled,
} = require("./services");
const { SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS, SMART_SHIP_AUTH_TOKENS } = require("./constants");
const { callLambdaFunction } = require("../../connector/lambda");
const WebhookClient = require("../../apps/webhookClients");

/**
 * webhook trigger
 */
const triggerWebhook = async (trackingData) => {
  try {
    // Testing phase
    // order_created_at >= 4th Jan
    // auth_token check [5 client - shopclues, bs, cred, nt, snitch]

    const trackingObj = _.cloneDeep(trackingData);
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
    await callLambdaFunction(lambdaPayload);
    return true;
  } catch (error) {
    logger.error("triggerWebhook", error);
    return false;
  }
};

module.exports = triggerWebhook;

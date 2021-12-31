const _ = require("lodash");

const logger = require("../../../logger");
const {
  webhookUserHandlingGetAndStoreInCache,
  getShopCluesAccessToken,
  hasCurrentStatusWebhookEnabled,
  sendWebhookDataToELK,
  statusCheckInHistoryMap,
} = require("./services");
const { SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS, SMART_SHIP_AUTH_TOKENS } = require("./constants");
const { callLambdaFunction } = require("../../connector/lambda");
const WebhookClient = require("../../apps/webhookClients");
const { checkIfCompulsoryEventAlreadySent } = require("./helpers");

/**
 * webhook trigger
 */
const triggerWebhook = async (trackingData, elkClient) => {
  try {
    // Testing phase
    // auth_token check [5 client - shopclues, bs, cred, nt, snitch]

    if (!["33d8f654722f8959c5f68271730f28de175485"].includes(trackingData?.auth_token)) {
      return false;
    }

    const isStatusAlreadyPresentInHistoryMap = await statusCheckInHistoryMap(trackingData);
    if (isStatusAlreadyPresentInHistoryMap) {
      return false;
    }

    const trackingObj = _.cloneDeep(trackingData);

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
    logger.error("triggerWebhook", error);
    return false;
  }
};

module.exports = triggerWebhook;

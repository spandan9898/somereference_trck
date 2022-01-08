const _ = require("lodash");

const logger = require("../../../logger");
const { prepareDataAndCallLambda, WebhookServices } = require("./services");
const { COMPULSORY_EVENTS } = require("./constants");

/**
 * webhook trigger
 */
const triggerWebhook = async (trackingData, elkClient) => {
  try {
    // Testing phase
    // auth_token check [5 client - shopclues, bs, cred, nt, snitch]

    const trackingObj = _.cloneDeep(trackingData);

    const webhookServices = new WebhookServices(trackingObj, elkClient);
    await webhookServices.compulsoryEventsHandler();

    const currentStatus = _.get(trackingObj, "status.current_status_type", "");
    if (COMPULSORY_EVENTS[currentStatus]) {
      return false;
    }

    await prepareDataAndCallLambda(trackingObj, elkClient);

    return true;
  } catch (error) {
    logger.error("triggerWebhook", error);
    return false;
  }
};

module.exports = triggerWebhook;

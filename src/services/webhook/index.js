/* eslint-disable no-promise-executor-return */
const _ = require("lodash");

const logger = require("../../../logger");
const {
  prepareDataAndCallLambda,
  WebhookServices,
  getWebhookUserDataFromCache,
} = require("./services");
const { COMPULSORY_EVENTS } = require("./constants");

/**
 * webhook trigger
 * @desc first check -> webhook user enabled.
 * if not then break the process, otherwise proceed
 */
const triggerWebhook = async (trackingData, elkClient) => {
  try {
    const webhookUserData = await getWebhookUserDataFromCache(trackingData.auth_token);

    if (_.isEmpty(webhookUserData)) {
      return false;
    }

    const trackingObj = _.cloneDeep(trackingData);

    const webhookServices = new WebhookServices(trackingObj, elkClient, webhookUserData);
    await webhookServices.compulsoryEventsHandler();

    const currentStatus = _.get(trackingObj, "status.current_status_type", "");
    if (COMPULSORY_EVENTS[currentStatus]) {
      return false;
    }

    await new Promise((done) => setTimeout(() => done(), 2000));

    await prepareDataAndCallLambda(trackingObj, elkClient, webhookUserData);

    return true;
  } catch (error) {
    logger.error("triggerWebhook", error);
    return false;
  }
};

module.exports = triggerWebhook;

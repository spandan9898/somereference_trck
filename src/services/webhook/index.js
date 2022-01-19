/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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

    const allTrackingData = (await webhookServices.compulsoryEventsHandler()) || [];

    const currentStatus = _.get(trackingObj, "status.current_status_type", "");

    if (!COMPULSORY_EVENTS[currentStatus]) {
      allTrackingData.push(trackingObj);
    }

    for (const trackObj of allTrackingData) {
      await prepareDataAndCallLambda(trackObj, elkClient, webhookUserData);
      await new Promise((done) => setTimeout(() => done(), 3000));
    }

    return true;
  } catch (error) {
    logger.error("triggerWebhook", error);
    return false;
  }
};

module.exports = triggerWebhook;

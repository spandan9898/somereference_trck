const _ = require("lodash");

const logger = require("../../../logger");
const {
  statusCheckInHistoryMap,
  prepareDataAndCallLambda,
  checkIfCompulsoryEventAlreadySent,
  WebhookServices,
} = require("./services");
const { COMPULSORY_EVENTS } = require("./constants");

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

    const webhookServices = new WebhookServices(trackingObj, elkClient);
    await webhookServices.compulsoryEventsHandler();

    const currentStatus = _.get(trackingObj, "status.current_status_type", "");
    if (currentStatus.includes(COMPULSORY_EVENTS)) {
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

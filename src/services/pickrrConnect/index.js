const logger = require("../../../logger");
const { preparePickrrConnectLambdaPayloadAndCall } = require("../../apps/pickrrConnect/services");
const { KafkaMessageHandler } = require("../common");

/**
 *
 * @param {*} consumedPayload
 * @desc payload format: {
 * tracking_id: "",
 * if_from_pull: true/false
 * }
 */
const pickrrConnectKafkaMessageHandler = (consumedPayload) => {
  try {
    const { message } = consumedPayload;
    const data = JSON.parse(message.value.toString());
    const { tracking_id: trackingId, is_from_pull: isFromPull } = data || {};
    if (!trackingId || !isFromPull) {
      return false;
    }
    const { prodElkClient } = KafkaMessageHandler.getElkClients();
    if (trackingId && isFromPull && prodElkClient) {
      preparePickrrConnectLambdaPayloadAndCall({
        trackingId,
        isFromPull,
        elkClient: prodElkClient,
      });
    }
    return true;
  } catch (error) {
    logger.error("pickrrConnectKafkaMessageHandler", error);
    return false;
  }
};

module.exports = {
  pickrrConnectKafkaMessageHandler,
};
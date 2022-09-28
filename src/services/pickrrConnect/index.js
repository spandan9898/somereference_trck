const logger = require("../../../logger");
const { preparePickrrConnectLambdaPayloadAndCall } = require("../../apps/pickrrConnect/services");
const { getElkClients } = require("../../utils");

/**
 *
 * @param {*} consumedPayload
 * @desc payload format: {
 * tracking_id: "",
 * if_from_pull: true/false
 * }
 */
const pickrrConnectKafkaMessageHandler = (consumedPayload) => {
  // consumedPayload contains courier field
  try {
    const { message } = consumedPayload;
    const data = JSON.parse(message.value.toString());
    const { tracking_id: trackingId, courier: courier, is_from_pull: isFromPull } = data || {};
    if (!trackingId || !isFromPull) {
      return false;
    }
    const { trackingElkClient } = getElkClients();
    if (trackingId && isFromPull && trackingElkClient) {
      preparePickrrConnectLambdaPayloadAndCall({
        trackingId,
        isFromPull,
        courier,
        elkClient: trackingElkClient,
      });
    }
    return true;
  } catch (error) {
    logger.error(`pickrrConnectKafkaMessageHandler ${error.stack} ${error}`);
    return false;
  }
};

module.exports = {
  pickrrConnectKafkaMessageHandler,
};

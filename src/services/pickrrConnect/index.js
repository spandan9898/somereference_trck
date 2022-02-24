const logger = require("../../../logger");
const { prepareLambdaPayloadAndCall } = require("../../apps/pickrrConnect/services");
const { KafkaMessageHandler } = require("../common");

/**
 *
 * @param {*} consumedPayload
 * @desc payload format: {
 * tracking_id: "",
 * if_from_pull: ""
 * }
 */
const pickrrConnectKafkaMessageHandler = (consumedPayload) => {
  try {
    const { message } = consumedPayload;
    const data = Object.values(JSON.parse(message.value.toString()))[0];
    const { tracking_id: trackingId, is_from_pull: isFromPull } = data || {};
    const { prodElkClient } = KafkaMessageHandler.getElkClients();
    if (trackingId && isFromPull && prodElkClient) {
      prepareLambdaPayloadAndCall({ trackingId, isFromPull, elkClient: prodElkClient });
    }
  } catch (error) {
    logger.error("pickrrConnectKafkaMessageHandler", error);
  }
};

module.exports = {
  pickrrConnectKafkaMessageHandler,
};

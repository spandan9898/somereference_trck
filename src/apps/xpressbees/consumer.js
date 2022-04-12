/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { XBS_PUSH_TOPIC_NAME, XBS_PUSH_GROUP_NAME } = require("./constant");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const pushConsumerInstance = kafka.consumer({ groupId: XBS_PUSH_GROUP_NAME });
  await pushConsumerInstance.connect();
  await pushConsumerInstance.subscribe({ topic: XBS_PUSH_TOPIC_NAME, fromBeginning: false });
  return {
    pushConsumerInstance,
  };
};

/**
 *
 * Listening kafka consumer
 */
const listener = async (consumer, partitionsCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionsCount,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "xpressbees");
      },
    });
  } catch (error) {
    logger.error("XBS Listening Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

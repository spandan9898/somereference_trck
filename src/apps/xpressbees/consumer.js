/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { PUSH_TOPIC_NAME, PUSH_GROUP_NAME } = require("./constant");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });
  return {
    pushConsumer,
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

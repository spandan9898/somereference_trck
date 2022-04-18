/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const { PUSH_GROUP_NAME, PUSH_TOPIC_NAME } = require("./constant");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 *
 * */
const initialize = async () => {
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });

  return {
    pushConsumer,
  };
};

/**
 * Listening kafka consumer
 * 1. Preparing data
 * 2. Redis checking
 * 3. update pull mongodb
 * 4. TODO
 */
const listener = async (consumer, partitionsCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionsCount,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "bluedart");
      },
    });
  } catch (error) {
    logger.error("Bluedart Listener error -->", error);
  }
};

module.exports = {
  initialize,
  listener,
};

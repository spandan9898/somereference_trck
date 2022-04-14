/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const { PUSH_TOPIC_COUNT, PUSH_GROUP_NAME, PUSH_TOPIC_NAME } = require("./constant");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "udaan-group" });
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  const topicsCount = new Array(PUSH_TOPIC_COUNT).fill(1);
  const topicConsumerInstances = topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `udaan_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Udaan Initialize Error", error);
    }
  });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });
  return {
    topicConsumerInstances,
    pushConsumer,
  };
};

/**
 *
 * Listening kafka consumer
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "udaan");
      },
    });
  } catch (error) {
    logger.error("Udaan Listening Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

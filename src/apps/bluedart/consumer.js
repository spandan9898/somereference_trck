/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const {
  BLUEDART_TOPICS_COUNT,
  BLUEDART_PUSH_GROUP_NAME,
  BLUEDART_PUSH_TOPIC_NAME,
} = require("./constant");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 *
 * */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "bluedart-group" });
  const pushConsumer = kafka.consumer({ groupId: BLUEDART_PUSH_GROUP_NAME });
  const topicsCount = new Array(BLUEDART_TOPICS_COUNT).fill(1);
  const topicConsumerInstances = topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `bluedart_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Bluedart Initialize Error", error);
    }
  });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: BLUEDART_PUSH_TOPIC_NAME, fromBeginning: false });

  return {
    topicConsumerInstances,
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

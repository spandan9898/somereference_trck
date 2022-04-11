/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { EKART_TOPICS_COUNT, PULL_CONSUMER_PARTITION_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const pushConsumer = kafka.consumer({ groupId: "ekart-group" });
  const pullConsumerInstance = kafka.consumer({ groupId: "ekart-group-pull" });
  const topicsCount = new Array(EKART_TOPICS_COUNT).fill(1);
  const consumersWithMultiTopics = topicsCount.map(async (_, index) => {
    try {
      await pushConsumer.connect();
      await pushConsumer.subscribe({ topic: `ekart_${index}`, fromBeginning: false });
      return pushConsumer;
    } catch (error) {
      logger.error("Ekart Push Initialise Error", error);
    }
  });
  pullConsumerInstance.connect();
  pullConsumerInstance.subscribe({ topic: "ekart_pull", fromBeginning: false });
  return {
    consumersWithMultiTopics,
    pullConsumerInstance,
  };
};

/**
 *
 * Listening kafka consumer
 */
const listener = async (consumer, isPartition) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: isPartition ? PULL_CONSUMER_PARTITION_COUNT : 1,
      eachMessage: (consumedPayload) => {
        const courierName = consumedPayload.topic === "ekart_pull" ? "ekart_pull" : "ekart";
        KafkaMessageHandler.init(consumedPayload, courierName);
      },
    });
  } catch (error) {
    logger.error("Ekart listener Error ", error);
  }
};

module.exports = {
  initialize,
  listener,
};

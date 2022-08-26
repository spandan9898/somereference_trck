/* eslint-disable consistent-return */
const kafkaInstance = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { PULL_GROUP_NAME, PULL_TOPIC_NAME } = require("./constant");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pullConsumer = kafka.consumer({ groupId: PULL_GROUP_NAME });

  await pullConsumer.connect();
  await pullConsumer.subscribe({ topic: PULL_TOPIC_NAME, fromBeginning: false });
  return pullConsumer;
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

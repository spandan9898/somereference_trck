/* eslint-disable consistent-return */
const kafkaInstance = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { PUSH_TOPIC_NAME, PUSH_GROUP_NAME } = require("./constant");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

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
        KafkaMessageHandler.init(consumedPayload, "ekart");
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

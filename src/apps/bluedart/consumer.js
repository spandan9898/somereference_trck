/* eslint-disable consistent-return */
const kafkaInstance = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const {
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
  PULL_TOPIC_NAME,
  PULL_GROUP_NAME,
} = require("./constant");
const logger = require("../../../logger");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 * Initialize consumer and subscribe to topics
 *
 * */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  const pullConsumer = kafka.consumer({ groupId: PULL_GROUP_NAME });
  await pushConsumer.connect();
  await pullConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });
  await pullConsumer.subscribe({ topic: PULL_TOPIC_NAME, fromBeginning: false });

  return {
    pushConsumer,
    pullConsumer,
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
        const courierName =
          consumedPayload.topic === "bluedart_pull" ? "bluedart_pull" : "bluedart";
        KafkaMessageHandler.init(consumedPayload, courierName);
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

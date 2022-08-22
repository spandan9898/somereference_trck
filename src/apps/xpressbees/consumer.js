/* eslint-disable consistent-return */
const kafkaInstance = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const {
  PUSH_TOPIC_NAME,
  PUSH_GROUP_NAME,
  PULL_TOPIC_NAME,
  PULL_GROUP_NAME,
} = require("./constant");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });

  const pullConsumer = kafka.consumer({ groupId: PULL_GROUP_NAME });
  await pullConsumer.connect();
  await pullConsumer.subscribe({ topic: PULL_TOPIC_NAME, fromBeginning: false });
  return {
    pushConsumer,
    pullConsumer,
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
        const courierName = consumedPayload.topic === "xbs_pull" ? "xpressbees_pull" : "xpressbees";
        KafkaMessageHandler.init(consumedPayload, courierName);
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

/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const {
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
  PULL_GROUP_NAME,
  PULL_TOPIC_NAME,
} = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const pullConsumer = kafka.consumer({ groupId: PULL_GROUP_NAME });
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });

  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });

  await pullConsumer.connect();
  await pullConsumer.subscribe({
    topic: PULL_TOPIC_NAME,
    fromBeginning: false,
  });

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
        const courierName =
          consumedPayload.topic === "delhivery_pull" ? "delhivery_pull" : "delhivery";

        KafkaMessageHandler.init(consumedPayload, courierName);
      },
    });
  } catch (error) {
    logger.error("Delhivery Listener Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

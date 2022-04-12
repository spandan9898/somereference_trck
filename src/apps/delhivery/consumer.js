/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const {
  TOTAL_TOPIC_COUNT,
  DELHIVERY_PUSH_GROUP_NAME,
  DELHIVERY_PUSH_TOPIC_NAME,
  DELHIVERY_PULL_GROUP_NAME,
  DELHIVERY_PULL_TOPIC_NAME,
  PUSH_CONSUMER_GROUP_NAME,
} = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const pushConsumer = kafka.consumer({ groupId: PUSH_CONSUMER_GROUP_NAME });
  const pullConsumer = kafka.consumer({ groupId: DELHIVERY_PULL_GROUP_NAME });
  const pushConsumerInstance = kafka.consumer({ groupId: DELHIVERY_PUSH_GROUP_NAME });

  const totalTopicsCount = new Array(TOTAL_TOPIC_COUNT).fill(1);
  const consumersWithMultiTopics = totalTopicsCount.map(async (_, index) => {
    try {
      await pushConsumer.connect();
      await pushConsumer.subscribe({ topic: `delhivery_${index}`, fromBeginning: false });
      return pushConsumer;
    } catch (error) {
      logger.error("Delhivery Initialize error -->", error);
    }
  });
  await pushConsumerInstance.connect();
  await pushConsumerInstance.subscribe({ topic: DELHIVERY_PUSH_TOPIC_NAME, fromBeginning: false });

  await pullConsumer.connect();
  await pullConsumer.subscribe({
    topic: DELHIVERY_PULL_TOPIC_NAME,
    fromBeginning: false,
  });

  return {
    pushConsumerInstance,
    consumersWithMultiTopics,
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

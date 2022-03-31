/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const {
  TOTAL_TOPIC_COUNT,
  PUSH_CONSUMER_GROUP_NAME,
  PULL_CONSUMER_GROUP_NAME,
  PULL_CONSUMER_TOPIC_NAME,
  PULL_CONSUMER_PARTITION_COUNT,
} = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const pushConsumer = kafka.consumer({ groupId: PUSH_CONSUMER_GROUP_NAME });
  const pullConsumer = kafka.consumer({ groupId: PULL_CONSUMER_GROUP_NAME });

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

  await pullConsumer.connect();
  await pullConsumer.subscribe({
    topic: PULL_CONSUMER_TOPIC_NAME,
    fromBeginning: false,
  });

  return {
    consumersWithMultiTopics,
    pullConsumer,
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

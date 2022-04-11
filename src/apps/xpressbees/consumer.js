/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const {
  XBS_PARTITION_COUNT,
  XBS_TOPICS_COUNT,
  XBS_PUSH_TOPIC_NAME,
  XBS_PUSH_GROUP_NAME,
} = require("./constant");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "xbs-group" });
  const pushConsumerInstance = kafka.consumer({ groupId: XBS_PUSH_GROUP_NAME });
  const topicsCount = new Array(XBS_TOPICS_COUNT).fill(1);
  const topicConsumerInstances = topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `xbs_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("XBS Initialize Error", error);
    }
  });
  await pushConsumerInstance.connect();
  await pushConsumerInstance.subscribe({ topic: XBS_PUSH_TOPIC_NAME, fromBeginning: false });
  return {
    topicConsumerInstances,
    pushConsumerInstance,
  };
};

/**
 *
 * Listening kafka consumer
 */
const listener = async (consumer, isMultiplePartition) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: isMultiplePartition ? XBS_PARTITION_COUNT : 1,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "xpressbees");
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

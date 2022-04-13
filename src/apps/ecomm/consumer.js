/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { ECOMM_TOPIC_COUNT, PUSH_GROUP_NAME, PUSH_TOPIC_NAME } = require("./constant");

/**
 *initialize consumer for ecomm
 * @returns
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "ecomm-group" });
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  const topicsCount = new Array(ECOMM_TOPIC_COUNT).fill(1);
  const topicConsumerInstances = topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `ecomm_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("ecomm Initialize Error", error);
    }
  });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });
  return {
    topicConsumerInstances,
    pushConsumer,
  };
};

/**
 *  consumer for ecomm payload
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "ecomm");
      },
    });
  } catch (error) {
    logger.error("Ecomm listener Error", error);
  }
};

module.exports = {
  listener,
  initialize,
};

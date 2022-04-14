/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { AMAZE_TOPICS_COUNT, PUSH_GROUP_NAME, PUSH_TOPIC_NAME } = require("./constant");

/**
 * initialize consumer for amaze payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "amaze-group" });
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  const topicsCount = new Array(AMAZE_TOPICS_COUNT).fill(1);
  const topicConsumerInstances = topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `amaze_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("amaze Initialize Error", error);
    }
  });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ groupId: PUSH_TOPIC_NAME, fromBeginning: false });
  return {
    topicConsumerInstances,
    pushConsumer,
  };
};

/**
 * listener amaze Producer
 * call preparator to prepare Pickrr data
 * check redis
 * update pull mongodb
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "amaze");
      },
    });
  } catch (error) {
    logger.error("Amaze Listener Error ", error);
  }
};
module.exports = { listener, initialize };

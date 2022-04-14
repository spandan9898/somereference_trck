/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { PARCELDO_TOPICS_COUNT, PUSH_GROUP_NAME, PUSH_TOPIC_NAME } = require("./constant");

/**
 * initialize consumer for parceldo payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "parceldo-group" });
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  const topicsCount = new Array(PARCELDO_TOPICS_COUNT).fill(1);
  const topicConsumerInstances = topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `parceldo_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("parceldo Initialize Error", error);
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
 * listener for parceldo producer
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "parceldo");
      },
    });
  } catch (error) {
    logger.error("Parceldo Listener Error", error);
  }
};

module.exports = { listener, initialize };

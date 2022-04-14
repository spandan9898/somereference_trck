/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { PUSH_GROUP_NAME, PUSH_TOPIC_NAME } = require("./constant");

/**
 * initialize consumer for parceldo payload
 */
const initialize = async () => {
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });

  return {
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

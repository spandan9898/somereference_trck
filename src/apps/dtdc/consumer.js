/* eslint-disable consistent-return */
const { PUSH_GROUP_NAME, PUSH_TOPIC_NAME } = require("./constant");
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * initialize consumers for pidge payload
 */
const initialize = async () => {
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  pushConsumer.connect();
  pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });
  return {
    pushConsumer,
  };
};

/**
 *
 * @param {*} consumer
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "dtdc");
      },
    });
  } catch (error) {
    logger.error("DTDC Listener Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

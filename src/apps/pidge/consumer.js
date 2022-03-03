/* eslint-disable consistent-return */
const { PIDGE_PARTITION_COUNT, PIDGE_TOPIC_NAME, PIDGE_GROUP_ID } = require("./constant");
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * initialize consumers for pidge payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: PIDGE_GROUP_ID });
  const partitionsCount = new Array(PIDGE_PARTITION_COUNT).fill(1);
  const consumerMapwithPartitions = partitionsCount.map(async () => {
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: PIDGE_TOPIC_NAME,
        fromBeginning: false,
      });
      return consumer;
    } catch (error) {
      logger.error("Pidge Initialization Error", error);
    }
  });
  return {
    consumerMapwithPartitions,
  };
};

/**
 *
 * @param {*} consumer
 */
const listener = async (consumer, isPartition) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: isPartition ? PIDGE_PARTITION_COUNT : 1,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "pidge");
      },
    });
  } catch (error) {
    logger.error("Pidge Listener Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

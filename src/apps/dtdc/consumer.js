/* eslint-disable consistent-return */
const { DTDC_GROUP_ID, DTDC_PARTITION_COUNT, DTDC_TOPIC_NAME } = require("./constant");
const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * initialize consumers for pidge payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: DTDC_GROUP_ID });
  const partitionsCount = new Array(DTDC_PARTITION_COUNT).fill(1);
  const consumerMapwithPartitions = partitionsCount.map(async () => {
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: DTDC_TOPIC_NAME,
        fromBeginning: false,
      });
      return consumer;
    } catch (error) {
      logger.error("DTDC Initialization Error", error);
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
      partitionsConsumedConcurrently: isPartition ? DTDC_PARTITION_COUNT : 1,
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

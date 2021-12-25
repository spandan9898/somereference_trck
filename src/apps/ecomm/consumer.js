/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { ECOMM_TOPIC_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 *initialize consumer for ecomm
 * @returns
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "ecomm-group" });
  const topicsCount = new Array(ECOMM_TOPIC_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `ecomm_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Ecomm listener error --> ", error);
    }
  });
};

/**
 *  consumer for ecomm payload
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
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

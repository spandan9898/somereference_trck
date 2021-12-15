/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { UDAAN_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "udaan-group" });
  const topicsCount = new Array(UDAAN_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `udaan_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Udaan Initialize", error);
    }
  });
};

/**
 *
 * Listening kafka consumer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "udaan");
      },
    });
  } catch (error) {
    logger.error("Udaan Listening Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

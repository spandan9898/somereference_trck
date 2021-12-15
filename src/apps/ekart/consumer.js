/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { EKART_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "ekart-group" });
  const topicsCount = new Array(EKART_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `ekart_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Ekart Initialize error -->", error.message);
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
        KafkaMessageHandler.init(consumedPayload, "ekart");
      },
    });
  } catch (error) {
    logger.error("Ekart listener Error ", error);
  }
};

module.exports = {
  initialize,
  listener,
};

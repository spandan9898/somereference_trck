/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { TOTAL_TOPIC_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 *
 * */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "bluedart-group" });
  const totalTopicsCount = new Array(TOTAL_TOPIC_COUNT).fill(1);
  return totalTopicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `bluedart_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Bluedart Initialize error -->", error);
    }
  });
};

/**
 * Listening kafka consumer
 * 1. Preparing data
 * 2. Redis checking
 * 3. update pull mongodb
 * 4. TODO
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "bluedart");
      },
    });
  } catch (error) {
    logger.error("Bluedart Listener error -->", error);
  }
};

module.exports = {
  initialize,
  listener,
};

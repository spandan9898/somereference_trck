/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { TOTAL_TOPIC_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "delhivery-group" });
  const totalTopicsCount = new Array(TOTAL_TOPIC_COUNT).fill(1);
  return totalTopicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `delhivery_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Delhivery Initialize error -->", error);
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
      autoCommitInterval: 60000,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "delhivery");
      },
    });
  } catch (error) {
    logger.error("Delhivery Listener Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

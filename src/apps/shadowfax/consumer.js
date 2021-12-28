/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { SHADOWFAX_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * initialize consumer for shadowfax payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "shadowfax-group" });
  const topicsCount = new Array(SHADOWFAX_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `shadowfax_${index}`, fromBeginning: true });
      return consumer;
    } catch (error) {
      logger.error("Shadowfax Initialize Error", error);
    }
  });
};

/**
 * consumer function for Shadowfax Payload
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "shadowfax");
      },
    });
  } catch (error) {
    logger.error("Shadowfax Listener error -->", error);
  }
};

module.exports = {
  listener,
  initialize,
};

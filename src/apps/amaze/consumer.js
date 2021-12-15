/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { AMAZE_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * initialize consumer for amaze payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "amaze-group" });
  const topicsCount = new Array(AMAZE_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `amaze_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Amaze Consumer Initialize Error --> ", error);
    }
  });
};

/**
 * listener amaze Producer
 * call preparator to prepare Pickrr data
 * check redis
 * update pull mongodb
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "amaze");
      },
    });
  } catch (error) {
    logger.error("Amaze Listener Error ", error);
  }
};

module.exports = { listener, initialize };

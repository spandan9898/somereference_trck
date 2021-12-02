/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { SHADOWFAX_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");

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
      console.error(error.message);
    }
  });
};

/**
 * consumer function for Shadowfax Payload
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "shadowfax");
      },
    });
  } catch (error) {
    console.error("error -->", error);
  }
};

module.exports = {
  listener,
  initialize,
};

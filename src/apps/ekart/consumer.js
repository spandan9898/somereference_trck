/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { EKART_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");

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
      console.log("error -->", error.message);
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
    console.error(error);
  }
};

module.exports = {
  initialize,
  listener,
};

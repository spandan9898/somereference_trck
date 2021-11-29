/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { XBS_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "xbs-group" });
  const topicsCount = new Array(XBS_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `xbs_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      console.error("error --> ", error.message);
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
        KafkaMessageHandler.init(consumedPayload, "xpressbees");
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

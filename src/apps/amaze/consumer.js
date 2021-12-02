/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { AMAZE_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");

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
      console.log("error --> ", error.message);
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
    console.log(error.message);
  }
};

module.exports = { listener, initialize };

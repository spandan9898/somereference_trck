/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { PARCELDO_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");

/**
 * initialize consumer for parceldo payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "parceldo-group" });
  const topicsCount = new Array(PARCELDO_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `parceldo_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      console.log("error -->", error.message);
    }
  });
};

/**
 * listener for parceldo producer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "parceldo");
      },
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { listener, initialize };

/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { PARCELDO_TOPICS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

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
      logger.error("Parceldo Initialize error -->", error);
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
    logger.error("Parceldo Listener Error", error);
  }
};

module.exports = { listener, initialize };

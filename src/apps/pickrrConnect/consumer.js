/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const {
  PARTITON_COUNT,
  PICKRR_CONNECT_TOPIC_NAME,
  PICKRR_CONNECT_GROUP_NAME,
} = require("./constant");
const logger = require("../../../logger");
const { pickrrConnectKafkaMessageHandler } = require("../../services/pickrrConnect");

/**
 * initialize consumer for Pickrr Connect
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: PICKRR_CONNECT_GROUP_NAME });
  const partitionsCount = new Array(PARTITON_COUNT).fill(1);
  return partitionsCount.map(async () => {
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: PICKRR_CONNECT_TOPIC_NAME,
        fromBeginning: false,
      });
      return consumer;
    } catch (error) {
      logger.error("Shadowfax Initialize Error", error);
    }
  });
};

/**
 * listener for Pickrr Connect producer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: PARTITON_COUNT,
      eachMessage: (consumedPayload) => {
        pickrrConnectKafkaMessageHandler(consumedPayload);
      },
    });
  } catch (error) {
    logger.error("Pickrr Connect Listener Error", error);
  }
};

module.exports = { listener, initialize };
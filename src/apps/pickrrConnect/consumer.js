/* eslint-disable consistent-return */
const kafkaInstance = require("../../connector/kafka");
const {
  PARTITON_COUNT,
  PICKRR_CONNECT_TOPIC_NAME,
  PICKRR_CONNECT_GROUP_NAME,
} = require("./constant");
const logger = require("../../../logger");
const { pickrrConnectKafkaMessageHandler } = require("../../services/pickrrConnect");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 * initialize consumer for Pickrr Connect
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);
  const consumer = kafka.consumer({ groupId: PICKRR_CONNECT_GROUP_NAME });
  const partitionsCount = new Array(PARTITON_COUNT).fill(1);
  await consumer.connect();
  await consumer.subscribe({
    topic: PICKRR_CONNECT_TOPIC_NAME,
    fromBeginning: false,
  });
  return consumer;
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

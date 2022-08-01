/* eslint-disable consistent-return */
const kafkaInstance = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { PUSH_GROUP_NAME, PUSH_TOPIC_NAME } = require("./constant");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 *initialize consumer for ecomm
 * @returns
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });

  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });

  return {
    pushConsumer,
  };
};

/**
 *  consumer for ecomm payload
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        const courierName = consumedPayload.topic === "ecomm_pull" ? "ecomm_pull" : "ecomm";
        KafkaMessageHandler.init(consumedPayload, courierName);
      },
    });
  } catch (error) {
    logger.error("Ecomm listener Error", error);
  }
};

module.exports = {
  listener,
  initialize,
};

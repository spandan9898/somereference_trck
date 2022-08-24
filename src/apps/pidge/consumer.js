/* eslint-disable consistent-return */
const kafkaInstance = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const {
  PUSH_TOPIC_NAME,
  PUSH_GROUP_NAME,
  PULL_GROUP_NAME,
  PULL_TOPIC_NAME,
} = require("./constant");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 * initialize consumers for pidge payload
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  const pullConsumer = kafka.consumer({ groupId: PULL_GROUP_NAME });

  await pushConsumer.connect();
  await pullConsumer.connect();

  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });
  await pullConsumer.subscribe({ topic: PULL_TOPIC_NAME, fromBeginning: false });
  return {
    pushConsumer,
    pullConsumer,
  };
};

/**
 *
 * @param {*} consumer
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        const courierName = consumedPayload.topic === "pidge_pull" ? "pidge_pull" : "pidge";
        KafkaMessageHandler.init(consumedPayload, courierName);
      },
    });
  } catch (error) {
    logger.error("Pidge Listener Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

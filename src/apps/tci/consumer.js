/* eslint-disable consistent-return */
const { PULL_GROUP_NAME, PULL_TOPIC_NAME } = require("./constant");

const kafkaInstance = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 * initialize consumers for tci payload
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pullConsumer = kafka.consumer({ groupId: PULL_GROUP_NAME });

  await pullConsumer.connect();
  await pullConsumer.subscribe({
    topic: PULL_TOPIC_NAME,
    fromBeginning: false,
  });

  return {
    pullConsumer,
  };
};

/**
 *
 * listening kafka consumers of both push and pull
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        KafkaMessageHandler.init(consumedPayload, "tci_pull");
      },
    });
  } catch (error) {
    logger.error("TCI Listener Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

/* eslint-disable consistent-return */
const {
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
  PULL_GROUP_NAME,
  PULL_CONSUMER_TOPIC_NAME,
} = require("./constant");

const kafkaInstance = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 * initialize consumers for dtdc payload
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pullConsumer = kafka.consumer({ groupId: PULL_GROUP_NAME });
  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });

  await pullConsumer.connect();
  await pullConsumer.subscribe({
    topic: PULL_CONSUMER_TOPIC_NAME,
    fromBeginning: false,
  });

  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, fromBeginning: false });
  return {
    pushConsumer,
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
        const courierName = consumedPayload.topic === "dtdc_pull" ? "dtdc_pull" : "dtdc_push";
        KafkaMessageHandler.init(consumedPayload, courierName);
      },
    });
  } catch (error) {
    logger.error("DTDC Listener Error", error);
  }
};

module.exports = {
  initialize,
  listener,
};

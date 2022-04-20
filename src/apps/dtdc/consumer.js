/* eslint-disable consistent-return */
const {
  DTDC_GROUP_ID,
  DTDC_TOPIC_NAME,
  PULL_CONSUMER_GROUP_NAME,
  PULL_CONSUMER_TOPIC_NAME,
} = require("./constant");

const kafka = require("../../connector/kafka");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

/**
 * initialize consumers for pidge payload
 */
const initialize = async () => {
  const pullConsumer = kafka.consumer({ groupId: PULL_CONSUMER_GROUP_NAME });
  await pullConsumer.connect();
  await pullConsumer.subscribe({
    topic: PULL_CONSUMER_TOPIC_NAME,
    fromBeginning: false,
  });

  const pushConsumer = kafka.consumer({ groupId: DTDC_GROUP_ID });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: DTDC_TOPIC_NAME, fromBeginning: false });

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

/* eslint-disable consistent-return */
const kafkaInstance = require("../../connector/kafka");
const { TOPIC_NAME, GROUP_NAME } = require("./constants");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");
const logger = require("../../../logger");
const { trackAutoSync } = require("./services");

/**
 *initialize consumer for Auto Sync
 * @returns
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pushConsumer = kafka.consumer({ groupId: GROUP_NAME });
  await pushConsumer.connect();
  await pushConsumer.subscribe({ topic: TOPIC_NAME, fromBeginning: false });
  return {
    pushConsumer,
  };
};

/**
 *  consumer for Track Auto Sync Payload
 * {"request":{"courier":"xpressbees_2kg","awb":"143935221898119"}}
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        trackAutoSync(consumedPayload);
        return {};
      },
    });
  } catch (error) {
    logger.error("Auto Sync listener Error", error);
  }
};

module.exports = {
  listener,
  initialize,
};

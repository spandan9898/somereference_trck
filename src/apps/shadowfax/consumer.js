/* eslint-disable consistent-return */
const avro = require("avro-js");
const get = require("lodash/get");

const kafkaInstance = require("../../connector/kafka");
const {
  PULL_TOPIC_NAME,
  PUSH_TOPIC_NAME,
  PUSH_GROUP_NAME,
  PULL_GROUP_NAME,
} = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

const avroType = avro.parse(`${__dirname}/type.avsc`);

/**
 * initialize consumer for shadowfax payload
 */
const initialize = async () => {
  const kafka = kafkaInstance.getInstance(KAFKA_INSTANCE_CONFIG.PROD.name);

  const pushConsumer = kafka.consumer({ groupId: PUSH_GROUP_NAME });
  const pullConsumer = kafka.consumer({ groupId: PULL_GROUP_NAME });
  await pushConsumer.connect();
  await pullConsumer.connect();
  await pushConsumer.subscribe({ topic: PUSH_TOPIC_NAME, frombeginning: false });
  await pullConsumer.subscribe({ topic: PULL_TOPIC_NAME, frombeginning: false });
  return {
    pushConsumer,
    pullConsumer,
  };
};

/**
 * consumer function for Shadowfax Payload
 */
const listener = async (consumer, partitionCount) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: partitionCount,
      eachMessage: (consumedPayload) => {
        try {
          const payload = avroType.fromBuffer(consumedPayload.message.value);
          const courierName =
            get(payload, "event") === "pull" ? "shadowfax_pull" : "shadowfax_pull_reverse";
          KafkaMessageHandler.init(payload, courierName);
        } catch {
          KafkaMessageHandler.init(consumedPayload, "shadowfax");
        }
      },
    });
  } catch (error) {
    logger.error("Shadowfax Listener error -->", error);
  }
};

module.exports = {
  listener,
  initialize,
};

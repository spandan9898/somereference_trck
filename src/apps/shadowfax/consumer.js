/* eslint-disable consistent-return */
const avro = require("avro-js");
const get = require("lodash/get");

const kafka = require("../../connector/kafka");
const {
  SHADOWFAX_PARTITIONS_COUNT,
  SHADOWFAX_PULL_TOPIC_NAME,
  SHADOWFAX_GROUP_NAME,
  SHADOWFAX_PUSH_TOPIC_NAME,
} = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

const avroType = avro.parse(`${__dirname}/type.avsc`);

/**
 * initialize consumer for shadowfax payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: SHADOWFAX_GROUP_NAME }); // Basis on single topic only
  const partitionsCount = new Array(SHADOWFAX_PARTITIONS_COUNT).fill(1);
  const pushPartitionConsumerInstances = partitionsCount.map(async () => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: SHADOWFAX_PUSH_TOPIC_NAME, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Shadowfax Initialize Error!", error);
    }
  });
  const pullPartitionConsumerInstances = partitionsCount.map(async () => {
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: SHADOWFAX_PULL_TOPIC_NAME,
        fromBeginning: false,
      });
      return consumer;
    } catch (error) {
      logger.error("Shadowfax Initialize Error", error);
    }
  });
  return {
    pushPartitionConsumerInstances,
    pullPartitionConsumerInstances,
  };
};

/**
 * consumer function for Shadowfax Payload
 */
const listener = async (consumer, isPartition) => {
  try {
    await consumer.run({
      autoCommitInterval: 60000,
      partitionsConsumedConcurrently: isPartition ? SHADOWFAX_PARTITIONS_COUNT : 1,
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

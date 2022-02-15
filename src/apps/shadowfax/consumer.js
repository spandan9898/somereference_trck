/* eslint-disable consistent-return */
const avro = require("avro-js");
const get = require("lodash/get");

const kafka = require("../../connector/kafka");
const { SHADOWFAX_TOPICS_COUNT, SHADOWFAX_PARTITIONS_COUNT } = require("./constant");
const { KafkaMessageHandler } = require("../../services/common");
const logger = require("../../../logger");

const avroType = avro.parse(`${__dirname}/type.avsc`);

/**
 * initialize consumer for shadowfax payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "shadowfax-group" });
  const pullConsumer = kafka.consumer({ groupId: "shadowfax" });
  const topicsCount = new Array(SHADOWFAX_TOPICS_COUNT).fill(1);
  const partitionsCount = new Array(SHADOWFAX_PARTITIONS_COUNT).fill(1);

  const consumerMapWithTopics = topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `shadowfax_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      logger.error("Shadowfax Initialize Error", error);
    }
  });
  const consumerMapWithPartitions = partitionsCount.map(async () => {
    try {
      await pullConsumer.connect();
      await pullConsumer.subscribe({ topic: "n_shadowfax", fromBeginning: false }); // TODO:
      return pullConsumer;
    } catch (error) {
      logger.error("Shadowfax Initialize Error", error);
    }
  });
  return {
    consumerMapWithTopics,
    consumerMapWithPartitions,
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

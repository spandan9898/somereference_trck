/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");

const prepareDelhiveryData = require("./services");
const { TOTAL_TOPIC_COUNT } = require("./constant");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "delhivery-group" });
  const totalTopicsCount = new Array(TOTAL_TOPIC_COUNT).fill(1);
  await consumer.connect();
  return totalTopicsCount.map(async (_, index) => {
    try {
      await consumer.subscribe({ topic: `delhivery_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      console.log("error -->", error.message);
    }
  });
};

/**
 *
 * Listening kafka consumer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message }) => {
        const res = prepareDelhiveryData(Object.values(JSON.parse(message.value.toString()))[0]);
        console.log(res);
      },
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  initialize,
  listener,
};

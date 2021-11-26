/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");

const { redisCheckAndReturnTrackData } = require("../../services/pull/services");
const { updateTrackDataToPullMongo } = require("../../services/pull");
const prepareDelhiveryData = require("./services");
const { TOTAL_TOPIC_COUNT } = require("./constant");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "delhivery-group" });
  const totalTopicsCount = new Array(TOTAL_TOPIC_COUNT).fill(1);
  return totalTopicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
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
      eachMessage: async ({ message, topic, partition }) => {
        console.log(`Topic: ${topic} | Partition ${partition}`);
        const res = prepareDelhiveryData(Object.values(JSON.parse(message.value.toString()))[0]);
        console.log(`AWB: ${res.awb}`);
        if (!res.awb) return;

        const trackData = await redisCheckAndReturnTrackData(res);
        if (!trackData) {
          console.log("Same data already exists");
          return;
        }
        await updateTrackDataToPullMongo(trackData);
        console.log("done");
        console.log("--");
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

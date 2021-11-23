/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { updateTrackDataToPullMongo } = require("../../services/pull");
const { redisCheckAndReturnTrackData } = require("../../services/pull/services");

const { EKART_TOPICS_COUNT } = require("./constant");
const prepareEkartData = require("./services");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "ekart-group" });
  const topicsCount = new Array(EKART_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `ekart_${index}`, fromBeginning: false });
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
        const res = prepareEkartData(Object.values(JSON.parse(message.value.toString()))[0]);
        if (!res.awb) return;

        const trackData = await redisCheckAndReturnTrackData(res);
        if (!trackData) {
          console.log("Same data already exists");
          return;
        }

        await updateTrackDataToPullMongo(trackData);
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

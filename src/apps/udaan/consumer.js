/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { updateTrackDataToPullMongo } = require("../../services/pull");
const { redisCheckAndReturnTrackData } = require("../../services/pull/services");

const { UDAAN_TOPICS_COUNT } = require("./constant");
const prepareUdaanData = require("./services");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "udaan-group" });
  const topicsCount = new Array(UDAAN_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `udaan_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      console.error(error);
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
        console.log(`Topic: ${topic} || Partition: ${partition}`);
        const res = prepareUdaanData(Object.values(JSON.parse(message.value.toString()))[0]);
        console.log(`AWB: ${res.awb}`);
        if (!res.awb) return;
        const trackData = await redisCheckAndReturnTrackData(res);
        if (!trackData) {
          console.log("data already exists!");
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

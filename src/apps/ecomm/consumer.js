/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");

const { updateTrackDataToPullMongo } = require("../../services/pull");
const { redisCheckAndReturnTrackData } = require("../../services/pull/services");

const { ECOMM_TOPIC_COUNT } = require("./constant");

const { prepareEcommData } = require("./services");

/**
 *initialize consumer for ecomm
 * @returns
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "ecomm-group" });
  const topicsCount = new Array(ECOMM_TOPIC_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `ecomm_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      console.log("error --> ", error.message);
    }
  });
};

/**
 *  consumer for ecomm payload
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        console.log(`Topic: ${topic} | Partition ${partition}`);
        const response = prepareEcommData(Object.values(JSON.parse(message.value.toString()))[0]);
        console.log(`AWB: ${response.awb}`);
        if (!response.awb) return;

        const trackData = await redisCheckAndReturnTrackData(response);
        if (!trackData) {
          console.log("data already exists !");
          return;
        }
        await updateTrackDataToPullMongo(trackData);
        console.log("done");
        console.log("--");
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listener,
  initialize,
};

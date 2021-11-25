/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");

const { updateTrackDataToPullMongo } = require("../../services/pull");
const { redisCheckAndReturnTrackData } = require("../../services/pull/services");

const { prepareParceldoData } = require("./services");
const { PARCELDO_TOPICS_COUNT } = require("./constant");

/**
 * initialize consumer for parceldo payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "parceldo-group" });
  const topicsCount = new Array(PARCELDO_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `parceldo_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      console.log("error -->", error.message);
    }
  });
};

/**
 * listener for parceldo producer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        console.log(`Topic: ${topic} | Partition ${partition}`);
        const response = prepareParceldoData(
          Object.values(JSON.parse(message.values.toString()))[0]
        );
        if (!response.awb) return;
        const trackData = redisCheckAndReturnTrackData(response);
        if (!trackData) {
          console.log("data already exists!");
          return;
        }
        await updateTrackDataToPullMongo(trackData);
      },
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { listener, initialize };

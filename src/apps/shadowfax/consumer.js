/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { prepareShadowfaxData } = require("./services");

const { updateTrackDataToPullMongo } = require("../../services/pull");
const { redisCheckAndReturnTrackData } = require("../../services/pull/services");

const { SHADOWFAX_TOPICS_COUNT } = require("./constant");

/**
 * initialize consumer for shadowfax payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "shadowfax-group" });
  const topicsCount = new Array(SHADOWFAX_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `shadowfax_${index}`, fromBeginning: true });
      return consumer;
    } catch (error) {
      console.error(error.message);
    }
  });
};

/**
 * consumer function for Shadowfax Payload
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        console.log(`Topic: ${topic} | Partition ${partition}`);
        const response = prepareShadowfaxData(
          Object.values(JSON.parse(message.value.toString()))[0]
        );
        console.log(`AWB: ${response.awb}`);

        if (!response.awb) return;
        const trackData = await redisCheckAndReturnTrackData(response);
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
    console.error("error -->", error);
  }
};

module.exports = {
  listener,
  initialize,
};

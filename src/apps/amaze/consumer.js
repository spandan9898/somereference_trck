/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");
const { updateTrackDataToPullMongo } = require("../../services/pull");
const { redisCheckAndReturnTrackData } = require("../../services/pull/services");

const { AMAZE_TOPICS_COUNT } = require("./constant");
const { prepareAmazeData } = require("./services");

/**
 * initialize consumer for amaze payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "amaze-group" });
  const topicsCount = new Array(AMAZE_TOPICS_COUNT).fill(1);
  return topicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `amaze_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      console.log("error --> ", error.message);
    }
  });
};

/**
 * listener amaze Producer
 * call preparator to prepare Pickrr data
 * check redis
 * update pull mongodb
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        console.log(`Topic: ${topic} | Partition ${partition}`);
        const response = prepareAmazeData(Object.values(JSON.parse(message.value.toString()))[0]);
        console.log(`AWB: ${response.awb}`);

        if (!response.awb) return;

        const trackData = await redisCheckAndReturnTrackData(response);
        if (!trackData) {
          console.log("data already exists");
          return;
        }
        await updateTrackDataToPullMongo(trackData);
        console.log("done");
        console.log("--");
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { listener, initialize };

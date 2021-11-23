/* eslint-disable consistent-return */
const kafka = require("../../connector/kafka");

const { updateTrackDataToPullMongo } = require("../../services/pull");
const { redisCheckAndReturnTrackData } = require("../../services/pull/services");

const { setObject } = require("../../utils/redis");

const { TOTAL_TOPIC_COUNT } = require("./constant");
const { preparePickrrBluedartDict } = require("./services");

/**
 * Initialize consumer and subscribe to topics
 *
 * */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "bluedart-group" });
  const totalTopicsCount = new Array(TOTAL_TOPIC_COUNT).fill(1);
  return totalTopicsCount.map(async (_, index) => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: `bluedart_${index}`, fromBeginning: false });
      return consumer;
    } catch (error) {
      console.log("error -->", error.message);
    }
  });
};

/**
 * Listening kafka consumer
 * 1. Preparing data
 * 2. Redis checking
 * 3. update pull mongodb
 * 4. TODO
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        console.log("topic -->", topic);
        console.log("partition -->", partition);
        const res = preparePickrrBluedartDict(
          Object.values(JSON.parse(message.value.toString()))[0]
        );
        const trackData = await redisCheckAndReturnTrackData(res);
        if (!trackData) {
          console.log("Same data already exists");
          return;
        }

        await updateTrackDataToPullMongo(trackData);
        setObject(trackData.awb, trackData);
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

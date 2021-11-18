const kafka = require("../../connector/kafka");
const { redisCheckAndReturnTrackData } = require("../../services/pull/services");
const { preparePickrrBluedartDict } = require("./services");

/**
 * Initialize consumer and subscribe to topics
 *
 * */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "bluedart-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "bluedart", fromBeginning: true });
  return consumer;
};

/**
 * Listening kafka consumer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message }) => {
        const res = preparePickrrBluedartDict(
          Object.values(JSON.parse(message.value.toString()))[0]
        );
        const trackData = await redisCheckAndReturnTrackData(res);
        console.log(trackData);
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

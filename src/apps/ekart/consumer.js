const kafka = require("../../connector/kafka");

const prepareEkartData = require("./services");

/**
 * Initialize consumer and subscribe to topics
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "ekart-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "ekart", fromBeginning: true });
  return consumer;
};

/**
 *
 * Listening kafka consumer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message }) => {
        const res = prepareEkartData(Object.values(JSON.parse(message.value.toString()))[0]);
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

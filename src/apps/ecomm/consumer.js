const kafka = require("../../connector/kafka");
const { prepareEcommData } = require("./services");

/**
 *initialize consumer for ecomm
 * @returns
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "ecomm-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "ecomm", fromBeginning: true });
  return consumer;
};

/**
 *  consumer for ecomm payload
 */
const listener = async (consumer) => {
  // use ecommData

  try {
    await consumer.run({
      eachMessage: async ({ message }) => {
        const response = prepareEcommData(Object.values(JSON.parse(message.value.toString()))[0]);
        console.log(response);
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

const kafka = require("../../connector/kafka");
const { prepareAmazeData } = require("./services");

/**
 * initialize consumer for amaze payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "amaze-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "amaze", fromBeginning: true });
  return consumer;
};

/**
 * listener for amaze Producer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message }) => {
        const response = prepareAmazeData(Object.values(JSON.parse(message.values.toString())));
        console.log(response);
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { listener, initialize };

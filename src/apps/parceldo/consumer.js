const kafka = require("../../connector/kafka");
const { prepareParceldoData } = require("./services");

/**
 * initialize consumer for parceldo payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "parceldo-group" });
  await consumer.connect();
  await consumer.subscribe({
    topic: "parceldo",
    fromBeginning: true,
  });
  return consumer;
};

/**
 * listener for parceldo producer
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message }) => {
        const response = prepareParceldoData(Object.values(JSON.parse(message.values.toString())));
        console.log(response);
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { listener, initialize };

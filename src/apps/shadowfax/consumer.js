const kafka = require("../../connector/kafka");
const { prepareShadowfaxData } = require("./services");

/**
 * initialize consumer for shadowfax payload
 */
const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "shadowfax-group" });
  await consumer.connect();
  await consumer.subscribe({
    topic: "shadowfax",
    fromBeginning: true,
  });
  return consumer;
};

/**
 * consumer function for Shadowfax Payload
 */
const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMesage: async ({ message }) => {
        const response = prepareShadowfaxData(Object.values(JSON.parse(message.value.toString())));
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

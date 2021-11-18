const kafka = require("../../connector/kafka");

const prepareDelhiveryData = require("./services");

const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "delhivery-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "delhivery", fromBeginning: true });
  return consumer;
};

const listener = async (consumer) => {
  try {
    await consumer.run({
      eachMessage: async ({ message }) => {
        const res = prepareDelhiveryData(Object.values(JSON.parse(message.value.toString()))[0]);
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

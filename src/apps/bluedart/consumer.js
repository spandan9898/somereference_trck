const kafka = require("../../connector/kafka");

const preparePickrrBluedartDict = require("./services");

const initialize = async () => {
  const consumer = kafka.consumer({ groupId: "bluedart-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "bluedart", fromBeginning: true });
  return consumer;
};

exports.listener = async () => {
  try {
    const consumer = await initialize();
    await consumer.run({
      eachMessage: async ({ message }) => {
        const res = preparePickrrBluedartDict(
          Object.values(JSON.parse(message.value.toString()))[0]
        );
        console.log("bluedart");
        console.log(res);
      },
    });
  } catch (error) {
    console.error(error);
  }
};

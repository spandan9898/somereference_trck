const prepareEkartData = require("./consumer");
const kafka = require("../../utils/kafka");

const main = async () => {
  const consumer = kafka.consumer({ groupId: "ekart-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "ekart", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        value: message.value.toString(),
      });
    },
  });
};

module.exports = main;
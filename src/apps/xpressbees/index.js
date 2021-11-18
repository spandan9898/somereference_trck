// const prepareXbsData = require("./consumer");

const kafka = require("../../utils/kafka");

const main = async () => {
  const consumer = kafka.consumer({ groupId: "xbs-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "xpressbees", fromBeginning: true });

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

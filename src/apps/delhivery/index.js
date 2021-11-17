const prepareDelhiveryData = require("./consumer");
const kafka = require("../../connector/kafka");

const main = async () => {
  const consumer = kafka.consumer({ groupId: "delhivery-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "delhivery", fromBeginning: true });

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

// const test = () => {
//   const response = prepareDelhiveryData({
//     Shipment: {
//       Status: {
//         Status: "Manifested",
//         StatusDateTime: "2019-01-09T17:10:42.767",
//         StatusType: "UD",
//         StatusLocation: "Chandigarh_Raiprkln_C (Chandigarh)",
//         Instructions: "Manifest uploaded",
//       },
//       PickUpDate: "2019-01-09T17:10:42.543",
//       NSLCode: "X-UCI",
//       Sortcode: "IXC/MDP",
//       ReferenceNo: "28",
//       AWB: "XXXXXXXXXXXX",
//       EDD: "2019-01-09T17:10:42.543",
//       Receivedby: "XXXX",
//     },
//   });
//   console.log(response);
// };

// test();

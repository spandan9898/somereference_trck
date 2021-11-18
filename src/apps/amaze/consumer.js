const { prepareAmazeData } = require("./services");

const listener = async () => {
  const amazeDictSample = {
    awb: "AWBNUMBER",
    current_status: "Undelivered",
    updatedBy: "Azadpur",
    location: "Azadpur",
    updatedAt: "2021-05-31 09:47:11",
    remarks: "COD Not Ready",
  };
  //amazeDict from producer
  console.log(amazeDictSample);
  prepareAmazeData(amazeDictSample);
};

module.exports = { listener };

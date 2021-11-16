const prepareDelhiveryData = require("./consumer");

const test = () => {
  const response = prepareDelhiveryData({
    Shipment: {
      Status: {
        Status: "Manifested",
        StatusDateTime: "2019-01-09T17:10:42.767",
        StatusType: "UD",
        StatusLocation: "Chandigarh_Raiprkln_C (Chandigarh)",
        Instructions: "Manifest uploaded",
      },
      PickUpDate: "2019-01-09T17:10:42.543",
      NSLCode: "X-UCI",
      Sortcode: "IXC/MDP",
      ReferenceNo: "28",
      AWB: "XXXXXXXXXXXX",
      EDD: "2019-01-09T17:10:42.543",
      Receivedby: "XXXX",
    },
  });
  console.log(response);
};

test();

const preparePickrrBluedartDict = require("./consumer");

const bluedartApp = () => {
  const res = preparePickrrBluedartDict({
    statustracking: [
      {
        Shipment: {
          SenderID: "Bluedart",
          ReceiverID: "SHOPCLUES",
          WaybillNo: "75456956632",
          Origin: "CHENNAI",
          OriginAreaCode: "GGN",
          Destination: "NEW DELHI",
          DestinationAreaCode: "SED",
          PickUpDate: "17-06-2019",
          PickUpTime: "0800",
          ShipmentMode: "R",
          ExpectedDeliveryDate: "30-12-2021",
          Feature: "L",
          RefNo: "",
          Prodcode: "A",
          SubProductCode: "P",
          Weight: "0",
          DynamicExpectedDeliveryDate: "",
          Scans: {
            ScanDetail: [
              {
                Scan: "PICKUP CANCELLED; QUALITY CHECK FAILED",
                ScanCode: "016",
                ScanGroupType: "S",
                ScanDate: "17-06-2019",
                ScanTime: "1850",
                ScannedLocation: "MANALI SERVICE CENTRE",
                ScanType: "PU",
                Comments: "Nia DK Store Andride Proj",
                ScannedLocationCode: "MLI",
                ScannedLocationCity: "CHENNAI",
                ScannedLocationStateCode: "TN",
                StatusTimeZone: "IST",
                StatusLatitude: "13.149873333333336",
                StatusLongitude: "80.29923666666667",
                SorryCardNumber: "",
                ReachedDestinationLocation: "N",
                SecureCode: "",
              },
            ],
            QCFailed: {
              Reason: "Not the same product",
              Pictures: [],
              Type: "F",
            },
            Reweigh: {
              MPSNumber: "",
              RWActualWeight: "",
              RWLength: "",
              RWBreadth: "",
              RWHeight: "",
              RWVolWeight: "",
            },
            FieldExecutiveDetails: {
              FeName: "",
              FeMobileNo: "",
              Feactivity: "",
            },
          },
        },
      },
      {
        Shipment: {
          SenderID: "Bluedart",
          ReceiverID: "SHOPCLUES",
          WaybillNo: "75456956632",
          Origin: "CHENNAI",
          OriginAreaCode: "GGN",
          Destination: "NEW DELHI",
          DestinationAreaCode: "SED",
          PickUpDate: "19-06-2019",
          PickUpTime: "0800",
          ShipmentMode: "R",
          ExpectedDeliveryDate: "30-12-2021",
          Feature: "L",
          RefNo: "",
          Prodcode: "A",
          SubProductCode: "P",
          Weight: "0",
          DynamicExpectedDeliveryDate: "",
          Scans: {
            ScanDetail: [
              {
                Scan: "PICKUP CANCELLED; QUALITY CHECK FAILED",
                ScanCode: "016",
                ScanGroupType: "S",
                ScanDate: "19-06-2019",
                ScanTime: "1850",
                ScannedLocation: "MANALI SERVICE CENTRE",
                ScanType: "PU",
                Comments: "Nia DK Store Andride Proj",
                ScannedLocationCode: "MLI",
                ScannedLocationCity: "CHENNAI",
                ScannedLocationStateCode: "TN",
                StatusTimeZone: "IST",
                StatusLatitude: "13.149873333333336",
                StatusLongitude: "80.29923666666667",
                SorryCardNumber: "",
                ReachedDestinationLocation: "N",
                SecureCode: "",
              },
            ],
            QCFailed: {
              Reason: "Not the same product",
              Pictures: [],
              Type: "F",
            },
            Reweigh: {
              MPSNumber: "",
              RWActualWeight: "",
              RWLength: "",
              RWBreadth: "",
              RWHeight: "",
              RWVolWeight: "",
            },
            FieldExecutiveDetails: {
              FeName: "",
              FeMobileNo: "",
              Feactivity: "",
            },
          },
        },
      },
    ],
  });

  console.log("res -->", res);
};

module.exports = bluedartApp;

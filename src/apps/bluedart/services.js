const _ = require("lodash");
const moment = require("moment");

const { BLUEDART_CODE_MAPPER_V2 } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/*
Courier Request Payload
{
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
  }
*/

/**
 *
 * Preparing pickrr dict of each tracking lists's item
 */
const preparePickrrObjData = (trackObj) => {
  const pickrrBluedartDict = {
    awb: "",
    scan_type: "",
    scan_datetime: "",
    track_info: "",
    track_location: "",
    received_by: "",
    pickup_datetime: "",
    EDD: "",
    pickrr_status: "",
    pickrr_sub_status_code: "",
    courier_status_code: "",
  };
  const {
    scan_code_id: scanCodeId,
    scan_datetime: scanDatetime,
    track_info: trackInfo,
    awb,
    scan_location: scanLocation,
  } = trackObj || {};
  const scanMappingItem = BLUEDART_CODE_MAPPER_V2[scanCodeId];
  if (!scanMappingItem) {
    return { err: "Unknown status code" };
  }

  pickrrBluedartDict.courier_status_code = scanCodeId;
  pickrrBluedartDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanMappingItem.scan_type] || "";
  pickrrBluedartDict.pickrr_sub_status_code = scanMappingItem.pickrr_sub_status_code;
  pickrrBluedartDict.scan_type =
    scanMappingItem.scan_type === "UD" ? "NDR" : scanMappingItem.scan_type;
  pickrrBluedartDict.scan_datetime = scanDatetime;
  pickrrBluedartDict.track_info = trackInfo;
  pickrrBluedartDict.awb = awb;
  pickrrBluedartDict.track_location = scanLocation;

  if (trackObj.EDD) pickrrBluedartDict.EDD = trackObj.EDD;
  if (trackObj.Receivedby) pickrrBluedartDict.received_by = trackObj.Receivedby;
  if (trackObj.pickup_datetime) pickrrBluedartDict.pickup_datetime = trackObj.pickup_datetime;

  return pickrrBluedartDict;
};

/**
 * Fetching only needful data from trackObj's statusTracking list(array)
 * and returning tracking list
 */
const getBluedartTrackingList = (trackObj) => {
  const trackingList = [];
  const trackData = _.cloneDeep(trackObj);
  try {
    const statusTracking = trackData.statustracking;
    if (!statusTracking) {
      return {
        trackingList,
        err: "Empty Tracking list",
      };
    }

    if (statusTracking.constructor !== Array) {
      trackData.statustracking = [trackData.statustracking];
    }
    statusTracking.forEach((track) => {
      const trackDict = {};

      const shipmentData = _.get(track, "Shipment", {});
      const trackingId = shipmentData?.WaybillNo;
      const scanDate = _.get(shipmentData, "Scans.ScanDetail[0].ScanDate");
      const scanTime = _.get(shipmentData, "Scans.ScanDetail[0].ScanTime");
      const timestamp = `${scanDate} ${scanTime}`;
      const scanDetails = _.get(shipmentData, "Scans.ScanDetail[0]", {});

      trackDict.scan_datetime = moment(timestamp, "DD-MM-YYYY hmm").format("YYYY-MM-DD HH:mm:ss");
      trackDict.scan_type = scanDetails?.ScanType;
      trackDict.scan_grp_type = scanDetails?.ScanGroupType;
      trackDict.track_info = scanDetails?.Scan;
      trackDict.scan_location = scanDetails?.ScannedLocation;
      trackDict.awb = trackingId;
      trackDict.scan_code_id = `${scanDetails?.ScanCode || ""}-${scanDetails?.ScanGroupType || ""}`;

      if (shipmentData.PickUpDate) {
        let pickupDate = `${shipmentData.PickUpDate} ${shipmentData.PickUpTime}`;
        pickupDate = moment(pickupDate, "DD-MM-YYYY hmm").format("YYYY-MM-DD HH:mm:ss");
        trackDict.pickup_datetime = pickupDate;
      }

      if (shipmentData.Scans?.DeliveryDetails) {
        trackDict.Receivedby = _.get(shipmentData, "Scans.DeliveryDetails.ReceivedBy");
        const singatureData = _.get(shipmentData, "Scans.DeliveryDetails.ReceivedBy.Signature", []);
        if (singatureData.length) trackDict.Signature = singatureData;
      }

      if (shipmentData.ExpectedDeliveryDate) {
        trackDict.EDD = moment(shipmentData.ExpectedDeliveryDate, "DD-MM-YYYY").toDate();
      }
      trackingList.push(trackDict);
    });

    const sortedTrackingList = _.chain(trackingList)
      .orderBy(
        trackingList,
        [
          function convertDateTime(item) {
            return new Date(item.scan_datetime);
          },
        ],
        ["desc"]
      )
      .map((item) => ({
        ...item,
        scan_datetime: moment(item.scan_datetime).format("YYYY-MM-DD HH:mm:ss"),
      }))
      .value();

    return {
      trackingList: sortedTrackingList,
    };
  } catch (error) {
    return {
      trackingList,
      err: error.message,
    };
  }
};

/**
 * Getting tracking list information
 * and preparing each item of the tracking list as our pickrr dict
 *
 */
const preparePickrrBluedartDict = (requestedTrackData) => {
  const result = getBluedartTrackingList(requestedTrackData);

  if (result.err) {
    return result.err;
  }

  const { trackingList } = result;
  if (_.isEmpty(trackingList)) {
    return {};
  }
  return preparePickrrObjData(trackingList[0]);
};

module.exports = {
  preparePickrrBluedartDict,
};

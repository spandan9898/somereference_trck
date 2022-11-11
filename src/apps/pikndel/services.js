const moment = require("moment");

const logger = require("../../../logger");

const { PIKNDEL_STATUS_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**

 * 

 * @param {*} payload 

{

   "ClientUniqueNo":"62503216",
   "AWB":"PD0055378",
   "OrderStatus":"DLD",
   "Message":"DELIVERED",
   "Time":"2022-05-28 19:04:31",
   "ReasonCode":"",
   "Reason":"",
   "OrderDate":"2022-05-27 12:05:01",
   "ExpectedDeliveryDate":"2022-05-28 21:00:00",
   "FE":{
      "Name":"HARISH CHANDRA",
      "Mobile":"8383071467"
   }
}
 */
const preparePikNDelData = (payload) => {
  const pickrrDict = {
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

  try {
    const {
      AWB,
      OrderStatus: orderStatus,
      Message: message,
      Time,
      ExpectedDeliveryDate,
      ReasonCode: reasonCode,
      Reason: reason,
      ReportingLat,
      ReportingLng,
    } = payload;
    pickrrDict.awb = AWB;
    let mapperString = null;
    if (orderStatus === "PEN" || orderStatus === "CAN") {
      mapperString = `${orderStatus}_${reasonCode}`;
    } else {
      mapperString = `${orderStatus}`;
    }

    const scanType = PIKNDEL_STATUS_MAPPER[mapperString.toLowerCase()] || "";
    if (!scanType) {
      return { err: "Unknown status code" };
    }
    let scanDatetime = moment(Time);
    scanDatetime = scanDatetime.isValid() ? scanDatetime.format("YYYY-MM-DD HH:mm:ss") : "";
    if (!scanDatetime) {
      return { err: "Invalid scan datetime" };
    }
    if (ExpectedDeliveryDate) {
      let eddDate = moment(ExpectedDeliveryDate, "YYYY-MM-DD HH:mm:ss");
      eddDate = eddDate.isValid() ? eddDate.format("YYYY-MM-DD HH:mm:ss") : "";
      if (eddDate) {
        pickrrDict.EDD = eddDate;
      }
    }

    pickrrDict.scan_datetime = scanDatetime;
    pickrrDict.courier_status_code = mapperString;
    pickrrDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
    pickrrDict.track_info = reason ? `${message} - ${reason}` : `${message}`;
    pickrrDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    if (scanType.scan_type === "PP") {
      pickrrDict.pickup_datetime = pickrrDict.scan_datetime;
    }
    pickrrDict.latitude = ReportingLat;
    pickrrDict.longitude = ReportingLng;
    return pickrrDict;
  } catch (error) {
    pickrrDict.err = error.message;

    return pickrrDict;
  }
};

/**
 *
 * @param {*} pikndelDict
 * @returns pickrrDict
 * {
  pod_no: "PD0078836",
  reported_on: "2022-07-19 19:16:59",
  short_code: "DLD",
  activity: "DELIVERED",
  reason_code: "",
  reason: "",
  google_location:
    "C3/4, near Pardeswar Dham Temple, Block C3, Keshav Puram, Tri Nagar, New Delhi, Delhi 110035, India",
  lat: "28.6891425",
  lng: "77.1574486",
  order_date: "2022-07-18 12:16:04",
  expected_delivery_date: "2022-07-19 21:00:00",
  fe: {
    fe_name: "Padam Singh",
    fe_mobile_no: "8447748501",
  },
  event : "pull",
  trackingId : "",
  isReverse : false
}
 */
const preparePulledPikndelData = (pikndelDict) => {
  const pickrrDict = {
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

  try {
    const {
      short_code: shortCode = "",
      reason_code: reasonCode = "",
      reported_on: reportedOn = "",
      expected_delivery_date: expectedDeliveryDate = "",
      reason = "",
      activity = "",
      pod_no: podNo = "",
      google_location: googleLocation = "",
      fe,
    } = pikndelDict;

    if (!podNo) {
      logger.error("Pikndel Pull Preparator --> No AWB found", pikndelDict);
      return {};
    }
    let mapperString = shortCode.toString();
    if (mapperString === "CAN" || mapperString === "PEN") {
      mapperString = reasonCode ? `${mapperString}_${reasonCode}` : mapperString;
    }
    const scanType = PIKNDEL_STATUS_MAPPER[mapperString.toLowerCase()];
    if (!scanType) {
      return { err: "No Scan Type Found" };
    }
    pickrrDict.awb = podNo;

    pickrrDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
    pickrrDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    let eventDateTime = reportedOn;
    eventDateTime = moment(eventDateTime).isValid
      ? moment(eventDateTime).format("YYYY-MM-DD HH:mm:ss")
      : moment().format("YYYY-MM-DD HH:mm:ss");
    let eddStamp = expectedDeliveryDate;
    eddStamp = moment(eddStamp).isValid() ? moment(eddStamp).format("YYYY-MM-DD HH:mm:ss") : "";
    pickrrDict.EDD = eddStamp;
    pickrrDict.scan_datetime = eventDateTime;
    pickrrDict.courier_status_code = mapperString;
    pickrrDict.track_info = reason ? `${activity} - ${reason}` : `${activity}`;
    pickrrDict.track_location = googleLocation;
    if (pickrrDict.scan_type === "PP") {
      pickrrDict.pickup_datetime = eventDateTime;
    }
    if (pickrrDict.scan_type === "DL") {
      pickrrDict.received_by = fe?.fe_name ? fe.fe_name : "";
    }

    pickrrDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[pickrrDict.scan_type];

    return pickrrDict;
  } catch (error) {
    logger.error("Failed Preparing Pickndel Dict ", error);

    return pickrrDict;
  }
};

module.exports = {
  preparePikNDelData,
  preparePulledPikndelData,
};

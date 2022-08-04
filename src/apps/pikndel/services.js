const moment = require("moment");
const _ = require("lodash");

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
    const mapperString = _.get(pikndelDict, "short_code", "").toString();

    const statusMappedData = PIKNDEL_STATUS_MAPPER[mapperString.toLowerCase()];

    if (!statusMappedData) {
      return { err: "No Scan Type Found" };
    }

    pickrrDict.awb = pikndelDict?.pod_no;
    if (!pickrrDict.awb) {
      logger.error("Pikndel Pull Preparator --> No AWB found", pikndelDict);
      return {};
    }

    pickrrDict.scan_type = statusMappedData.scan_type;

    pickrrDict.pickrr_sub_status_code = statusMappedData.pickrr_sub_status_code;

    let eventDateTime = _.get(pikndelDict, "reported_on", "");

    eventDateTime = moment(eventDateTime).isValid
      ? moment(eventDateTime).format("YYYY-MM-DD HH:mm:ss")
      : moment().format("YYYY-MM-DD HH:mm:ss");

    let eddStamp = _.get(pikndelDict, "expected_delivery_date", "");

    eddStamp = moment(eddStamp).isValid() ? moment(eddStamp).format("YYYY-MM-DD HH:mm:ss") : "";

    pickrrDict.EDD = eddStamp;

    pickrrDict.scan_datetime = eventDateTime;

    pickrrDict.courier_status_code = mapperString;

    if (pickrrDict.scan_type === "PP") {
      pickrrDict.pickup_datetime = eventDateTime;
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

const _ = require("lodash");
const moment = require("moment");
const { CODE_MAPPER, STATION_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**
 *
 * @param {*} smartrDict
 * {
{
    "courier_code": "Smart Express",
    "awb_number": "10845612",
    "order_number": "XSE-10845612",
    "status_code": "001",
    "status_description": "Spipment Manifested",  --> make clarity on this
    "event_datetime": "2022-04-20T04:41:00",
    "location": "SKHX", >doubt where take location or cirty<
    "city": "SKHX", -|
    "state": "",
    "country": "India",
    "pieces": "1",
    "weight": "0.42",
    "lat": "0.0000000",
    "long": "0.0000000",
    "pod": "",
    "otp_delivery": "",
    "delivery_agent": "",
    "ref_awb": "",  ---> > doubt on this <
    "remarks": "",
    "status_update_number": "234567"
}
 * }
 */
const prepareSmartrData = (smartrDict) => {
  const pickrrSmartrDict = {
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
  pickrrSmartrDict.awb = _.get(smartrDict, "awb_number", "").toString();
  let mapperString = "";
  if (smartrDict.eventType) {
    mapperString = smartrDict.eventType.toString();
    if (
      ["PICKUP_CANCELLED", "UNDELIVERED", "RTO_UNDELIVERED"].includes(smartrDict.eventType) &&
      smartrDict?.reasonBO?.reasonCode
    ) {
      mapperString += `_${smartrDict?.reasonBO?.reasonCode}`;
    }
  }
  if (!mapperString) {
    return {};
  }
  const scanType = CODE_MAPPER[mapperString.toLowerCase()];
  if (!scanType) {
    return { err: "Unknown status code" };
  }

  let statusDate = moment(smartrDict?.eventTime, "YYYY-MM-DD HH:mm:ss");
  statusDate = statusDate.isValid()
    ? statusDate.format("YYYY-MM-DD HH:mm:ss.SSS")
    : moment().format("YYYY-MM-DD HH:mm:ss.SSS");
  if (scanType.scan_type === "PP") {
    pickrrSmartrDict.pickup_datetime = statusDate;
  }
  pickrrSmartrDict.scan_datetime = statusDate;
  pickrrSmartrDict.courier_status_code = mapperString;
  pickrrSmartrDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
  pickrrSmartrDict.track_info =
    smartrDict?.remarks || PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
  pickrrSmartrDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
  pickrrSmartrDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
  pickrrSmartrDict.track_location = STATION_MAPPER[smartrDict?.location?.toString()] || "";

  return pickrrSmartrDict;
};
module.exports = {
  prepareSmartrData,
};

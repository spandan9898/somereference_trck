const _ = require("lodash");
const moment = require("moment");
const { CODE_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**
 *
 * @param {*} loadshareDict
 * {
 * "waybillNo":"PR16519058502111641",
 * "orderRefNo":"60410346",
 * "userName":"Manjunath",
 * "eventTime":"2022-05-07 15:05:58",
 * "eventType":"INWARD_SCAN",
 * "locationName":"Jalahalli",
 * "locationCity":"Bangalore west",
 * "state":"",
 * "remarks":"",
 * "podLink":"",
 * "reasonBO":
 *  {
 *      "reasonCode":"",
 *      "reasonDescription":""
 *  }
 * }
 */
const prepareLoadshareData = (loadshareDict) => {
  const pickrrLoadshareDict = {
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
  pickrrLoadshareDict.awb = _.get(loadshareDict, "waybillNo", "").toString();
  let mapperString = "";
  if (loadshareDict.eventType) {
    mapperString = loadshareDict.eventType.toString();
    if (
      ["PICKUP_CANCELLED", "UNDELIVERED", "RTO_UNDELIVERED"].includes(loadshareDict.eventType) &&
      loadshareDict?.reasonBO?.reasonCode
    ) {
      mapperString += `_${loadshareDict?.reasonBO?.reasonCode}`;
    }
  }
  if (!mapperString) {
    return {};
  }
  const scanType = CODE_MAPPER[mapperString.toLowerCase()];
  if (!scanType) {
    return { err: "Unknown status code" };
  }

  let statusDate = moment(loadshareDict?.eventTime, "YYYY-MM-DD HH:mm:ss");
  statusDate = statusDate.isValid()
    ? statusDate.add(330, "minute").format("YYYY-MM-DD HH:mm:ss.SSS")
    : moment().format("YYYY-MM-DD HH:mm:ss.SSS");
  if (scanType.scan_type === "PP") {
    pickrrLoadshareDict.pickup_datetime = statusDate;
  }
  pickrrLoadshareDict.scan_datetime = statusDate;
  pickrrLoadshareDict.courier_status_code = mapperString;
  pickrrLoadshareDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
  pickrrLoadshareDict.track_info = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
  pickrrLoadshareDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
  pickrrLoadshareDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
  pickrrLoadshareDict.track_location = loadshareDict?.locationCity.toString();
  return pickrrLoadshareDict;
};
module.exports = {
  prepareLoadshareData,
};

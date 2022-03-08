const _ = require("lodash");
const moment = require("moment");
const { DTDC_CODE_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**
 * 
 * @param {*} dtdcDict
 *sample payload --> {
  "shipment": {
    "strShipmentNo": "B32242001",
    "strRefNo": "",
    "strCNTypeCode": "BF014",
    "strCNProduct": "LITE",
    "strOrigin": "BANGALORE",
    "strBookedOn": "21062017"
  },
  "shipmentStatus": [
    {
      "strAction": "BKD",
      "strActionDesc": "Booked",
      "strManifestNo": "",
      "strOrigin": "BANGALORE SURFACE APEX",
      "strActionDate": "21062017",
      "strActionTime": "1530",
      "strRemarks": ""
    }
  ]
}
 */
const prepareDtdcData = (dtdcDict) => {
  const pickrrDtdcDict = {
    awb: "",
    scan_type: "", //
    scan_datetime: "",
    track_info: "",
    track_location: "",
    received_by: "",
    pickup_datetime: "",
    EDD: "",
    pickrr_status: "", //
    pickrr_sub_status_code: "",
    courier_status_code: "",
  };
  try {
    pickrrDtdcDict.awb = _.get(dtdcDict, "shipment.strShipmentNo", "").toString();
    const actionString = _.get(dtdcDict, "shipmentStatus[0].strAction", "");
    const actionRemarks = _.get(dtdcDict, "shipmentStatus[0].strRemarks");
    let statusString = "";
    if (actionString) {
      if (["NONDLV", "PCNO"].includes(actionString)) {
        statusString = actionRemarks ? `${actionString}_${actionRemarks}` : `${actionString}`;
      } else {
        statusString = `${actionString}`;
      }
    } else {
      return {};
    }
    const scanType = DTDC_CODE_MAPPER[statusString.toLowerCase()];
    if (!scanType) {
      return { err: "Unknown status code" };
    }

    const statusDatetime = `${dtdcDict.shipmentStatus[0].strActionDate} ${dtdcDict.shipmentStatus[0].strActionTime}`;
    const statusDate = statusDatetime
      ? moment(statusDatetime, "DDMMYYYY hhm").format("YYYY-MM-DD HH:mm:ss")
      : moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    if (scanType.scan_type === "PP") {
      pickrrDtdcDict.pickup_datetime = statusDate;
    }
    pickrrDtdcDict.scan_datetime = statusDate;
    pickrrDtdcDict.courier_status_code = statusString;
    pickrrDtdcDict.scan_type = scanType.scan_type;
    pickrrDtdcDict.track_info = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrDtdcDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrDtdcDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    pickrrDtdcDict.track_location = _.get(dtdcDict, "shipmentStatus[0].strOrigin", "");
    return pickrrDtdcDict;
  } catch (error) {
    pickrrDtdcDict.err = error.message;
    return pickrrDtdcDict;
  }
};

module.exports = {
  prepareDtdcData,
};

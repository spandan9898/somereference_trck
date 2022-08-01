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
  "shipmentStatus": 
    {
      "strAction": "BKD",
      "strActionDesc": "Booked",
      "strManifestNo": "",
      "strOrigin": "BANGALORE SURFACE APEX",
      "strActionDate": "21062017",
      "strActionTime": "1530",
      "strRemarks": ""
    }
}
 */
const prepareDtdcData = (dtdcDict) => {
  const pickrrDtdcDict = {
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
    pickrrDtdcDict.awb = _.get(dtdcDict, "shipment.strShipmentNo", "").toString();
    const actionString = _.get(dtdcDict, "shipmentStatus.strAction", "");
    const actionRemarks = _.get(dtdcDict, "shipmentStatus.strRemarks");
    let statusString = "";
    if (actionString) {
      if (["nondlv", "pcno"].includes(actionString.toLowerCase())) {
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

    const statusDatetime = `${dtdcDict.shipmentStatus.strActionDate} ${dtdcDict.shipmentStatus.strActionTime}59999`;
    let statusDate = moment(statusDatetime, "DDMMYYYY hhms.SSS");
    statusDate = statusDate.isValid()
      ? statusDate.format("YYYY-MM-DD HH:mm:ss.SSS")
      : moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    if (scanType.scan_type === "PP") {
      pickrrDtdcDict.pickup_datetime = statusDate;
    }
    pickrrDtdcDict.scan_datetime = statusDate;
    pickrrDtdcDict.courier_status_code = statusString;
    pickrrDtdcDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
    pickrrDtdcDict.track_info = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type] || "";
    pickrrDtdcDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrDtdcDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    pickrrDtdcDict.track_location = _.get(dtdcDict, "shipmentStatus.strOrigin", "");
    const otpDesc = (dtdcDict?.shipmentStatus?.strActionDesc || "").toLowerCase();
    if (otpDesc.includes("otp based delivered")) {
      pickrrDtdcDict.otp_remarks = otpDesc;
    }
    return pickrrDtdcDict;
  } catch (error) {
    pickrrDtdcDict.err = error.message;
    return pickrrDtdcDict;
  }
};

/**
 * 
 * @param {*} dtdcDict 
 * {
    "strCode": "PCAW",
    "strAction": "Pickup Awaited",
    "strManifestNo": "",
    "strOrigin": "HUB OFFICE",
    "strDestination": "",
    "strOriginCode": "J03",
    "strDestinationCode": "",
    "strActionDate": "11042022",
    "strActionTime": "2113",
    "sTrRemarks": "", 
    "trackingId" : "AWBNUMBER",
    "event" : "pull",
    "edd" : "12212021",
    "receivedBy" : "",
}
 */
const prepareDtdcPulledData = (dtdcDict) => {
  const pickrrDtdcDict = {
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
      strCode,
      receivedBy,
      strOrigin,
      strDestination,
      strRemarks,
      edd,
      trackingId,
      strActionDate,
      strActionTime,
    } = dtdcDict || {};
    if (!trackingId) {
      return {
        err: "Tracking ID not available",
      };
    }

    let statusString = "";
    if (strCode) {
      if (["nondlv", "pcno"].includes(strCode.toLowerCase())) {
        statusString = strRemarks ? `${strCode}_${strRemarks}` : `${strCode}`;
      } else {
        statusString = `${strCode}`;
      }
    } else {
      return {};
    }
    const scanType = DTDC_CODE_MAPPER[statusString.toLowerCase()];
    if (!scanType) {
      return { err: "Unknown status code" };
    }
    const statusDatetime = `${strActionDate} ${strActionTime}59999`;
    let statusDate = moment(statusDatetime, "DDMMYYYY hhms.SSS");
    statusDate = statusDate.isValid()
      ? statusDate.format("YYYY-MM-DD HH:mm:ss.SSS")
      : moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    if (scanType === "PP") {
      pickrrDtdcDict.pickup_datetime = moment(statusDate).toDate();
    }
    let received = "";
    if (scanType === "DL") {
      received = receivedBy;
    }
    let eddDate = moment(`${edd} 000000000`, "DDMMYYYY hhms.SSS");
    eddDate = eddDate.isValid() ? eddDate.format("YYYY-MM-DD HH:mm:ss.SSS") : "";
    const trackLocation = strDestination || strOrigin;
    pickrrDtdcDict.scan_datetime = statusDate;
    pickrrDtdcDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
    pickrrDtdcDict.track_location = trackLocation;
    pickrrDtdcDict.awb = trackingId;
    pickrrDtdcDict.courier_status_code = statusString;
    pickrrDtdcDict.track_info = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrDtdcDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrDtdcDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    pickrrDtdcDict.received_by = received;

    pickrrDtdcDict.EDD = eddDate;
    return pickrrDtdcDict;
  } catch (error) {
    pickrrDtdcDict.err = error.message;
    return pickrrDtdcDict;
  }
};

module.exports = {
  prepareDtdcData,
  prepareDtdcPulledData,
};

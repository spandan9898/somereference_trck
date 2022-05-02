const moment = require("moment");

const { KERRYINDEV_CODE_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { mapReverseScanType } = require("../../utils/helpers");

/**
 * 
 * @param {*} kerryindevDict 
 * {
    "awbno": "2022764086",
    "Statusdate": "02-May-2022",
    "Statustime": "14:22:11",
    "Statuscode": "SAO",
    "Remarks": "Shipment Arrival In HYD Branch",
    "Location": "HYD",
    "EmployeeID": "V00524",
    "Reason": "",
    "LatnLong": ""
    "trackingId" : "AWBNUMBER",
    "event" : "pull",
    "returnWaybill" : ""
}
 */
const prepareKerryIndevPulledData = (kerryindevDict) => {
  const pickrrKerryIndevDict = {
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
    const { Statuscode, Statusdate, Statustime, returnWaybill, Location, trackingId } =
      kerryindevDict || {};
    if (!trackingId) {
      return {
        err: "Tracking ID not available",
      };
    }

    const statusString = Statuscode;
    let scanType = "";
    scanType = KERRYINDEV_CODE_MAPPER[statusString.toLowerCase()];
    if (!scanType) {
      return { err: "Unknown status code" };
    }
    if (returnWaybill && scanType === "RTD") {
      scanType = "RTO";
    }
    if (returnWaybill) {
      scanType = mapReverseScanType(scanType);
    }
    const statusDatetime = `${Statusdate} ${Statustime}`;
    let statusDate = moment(statusDatetime, "DD-MMM-YYYY HH:mm:ss");
    statusDate = statusDate.isValid()
      ? statusDate.format("YYYY-MM-DD HH:mm:ss.SSS")
      : moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    if (scanType === "PP") {
      pickrrKerryIndevDict.pickup_datetime = moment(statusDate).toDate();
    }

    pickrrKerryIndevDict.scan_datetime = statusDate;
    pickrrKerryIndevDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
    pickrrKerryIndevDict.track_location = Location || "";
    pickrrKerryIndevDict.awb = trackingId;
    pickrrKerryIndevDict.courier_status_code = statusString;
    pickrrKerryIndevDict.track_info = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrKerryIndevDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrKerryIndevDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    pickrrKerryIndevDict.received_by = "";

    pickrrKerryIndevDict.EDD = null;
    return pickrrKerryIndevDict;
  } catch (error) {
    pickrrKerryIndevDict.err = error.message;
    return pickrrKerryIndevDict;
  }
};

module.exports = {
  prepareKerryIndevPulledData,
};

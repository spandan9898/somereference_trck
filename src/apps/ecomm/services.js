const moment = require("moment");
const _ = require("lodash");
const { ECOMM_CODE_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/*
sample ecomm payload: {
            "awb": "AWB_NUMBER",
            "datetime": "YYYY-MM-DD HH:MM:SS",
            "status": "remark",
            "reason_code": "777 - RTS - Return To Shipper",
            "reason_code_number": "777",
            "location": "JRD",
            "Employee": "Name of Employee",
            "status_update_number": "44591782",
            "order_number": "ORDER_NUMBER",
            "city": "Vadodara",
            "ref_awb": ""
            }
*/

/**
 *
 * @param {*} ecommDict
 */
const prepareEcommData = (ecommDict) => {
  const pickrrEcommDict = {
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
    const { received_by: receivedBy, reason_code_number: reasonCodeNumber, EDD } = ecommDict || {};
    if (reasonCodeNumber in ECOMM_CODE_MAPPER) {
      const reasonDict = ECOMM_CODE_MAPPER[reasonCodeNumber];
      const pickrrStatusCode = reasonDict.pickrr_status_code;
      const scanType = pickrrStatusCode === "UD" ? "NDR" : pickrrStatusCode;
      const pickrrSubstatusCode = reasonDict.pickrr_sub_status_code;
      const scanDatetime = moment(ecommDict.datetime).format("YYYY-MM-DD HH:mm:ss");
      console.log("scanDatetime", scanDatetime);
      let remarks = `${ecommDict.status.trim()} ${ecommDict.reasonCode?.replace("-", "")?.trim()}`;
      pickrrEcommDict.scan_datetime = scanDatetime || "";
      pickrrEcommDict.received_by = receivedBy || "";
      pickrrEcommDict.EDD = EDD ? moment(EDD).format("YYYY-MM-DD HH:mm:ss") : "";

      if (scanType === "RTD") {
        remarks = "Order Returned to Consignee";
      }
      if (scanType === "RTO") {
        remarks = "Order Returned Back";
      }
      pickrrEcommDict.scan_type = scanType;
      pickrrEcommDict.track_info = remarks;
      pickrrEcommDict.awb = _.get(ecommDict, "awb", "");
      pickrrEcommDict.track_location = _.get(ecommDict, "location", "");
      pickrrEcommDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType];
      pickrrEcommDict.pickrr_sub_status_code = pickrrSubstatusCode;
      pickrrEcommDict.courier_status_code = reasonCodeNumber;
      if (scanType === "PP") {
        const pickupDatetime = scanDatetime;
        pickrrEcommDict.pickup_datetime = pickupDatetime;
      }
    }
    return pickrrEcommDict;
  } catch (error) {
    pickrrEcommDict.err = error;
    return pickrrEcommDict;
  }
};

module.exports = {
  prepareEcommData,
};

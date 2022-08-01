const moment = require("moment");
const _ = require("lodash");
const { ECOMM_CODE_MAPPER, ECOMM_CHILD_CODE_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const logger = require("../../../logger");

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
 * @param {*} ecomDict
 */
const checkReasonCodeAndReturnCodeMapper = (ecomDict) => {
  try {
    const {
      reason_code_number: reasonCodeNumber,
      child_reason_code_number: childReasonCodeNumber,
    } = ecomDict || {};
    if (
      childReasonCodeNumber &&
      ECOMM_CHILD_CODE_MAPPER[childReasonCodeNumber.toString().toLowerCase()]
    ) {
      return {
        codeNumber: childReasonCodeNumber,
        codeMapper: ECOMM_CHILD_CODE_MAPPER[childReasonCodeNumber.toString().toLowerCase()],
      };
    }
    if (reasonCodeNumber && ECOMM_CODE_MAPPER[reasonCodeNumber.toString().toLowerCase()]) {
      return {
        codeNumber: reasonCodeNumber,
        codeMapper: ECOMM_CODE_MAPPER[reasonCodeNumber.toString().toLowerCase()],
      };
    }
    return {};
  } catch (error) {
    logger.error("checkReasonCodeAndReturnCodeMapper", error);
    return {};
  }
};

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
    const { received_by: receivedBy, EDD } = ecommDict || {};
    const reasonCodeReturnCode = checkReasonCodeAndReturnCodeMapper(ecommDict);
    if (!_.isEmpty(reasonCodeReturnCode)) {
      const reasonDict = reasonCodeReturnCode.codeMapper;
      const pickrrStatusCode = reasonDict.pickrr_status_code;
      const scanType = pickrrStatusCode === "UD" ? "NDR" : pickrrStatusCode;
      const pickrrSubstatusCode = reasonDict.pickrr_sub_status_code;
      const scanDatetime = moment(ecommDict.datetime).format("YYYY-MM-DD HH:mm:ss");
      let remarks = `${ecommDict.status.trim()} ${ecommDict.reason_code?.replace("-", "")?.trim()}`;
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
      pickrrEcommDict.courier_status_code = reasonCodeReturnCode.codeNumber;
      if (scanType === "PP") {
        pickrrEcommDict.pickup_datetime = scanDatetime;
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

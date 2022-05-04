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

/**
 *
 * @param {*} ecommDict
 * {
      trackingId: '2940050127',
      city: 'BENGALURU',
      consignee: 'krishna murthy s',
      customer: 'PICKRR TECHNOLOGIES PRIVATE LIMITED - 261088',
      deliveryDate: '2022-05-02 10:48:46',
      destination: 'CHIKKABALLAPUR-CKK',
      edd: '03-May-2022',
      pickupdate: '30-Apr-2022',
      returnWaybillNo: '',
      isReverse: false,
      event: 'pull',
      courierUsed: 'ecommexpress',
      updated_on: '02 May, 2022, 10:48 ',
      status: 'Shipment delivered',
      reason_code: '999 - Delivered',
      reason_code_number: '999',
      scan_status: 'HOLD',
      location: 'CKK',
      location_city: 'BENGALURU',
      location_type: 'Service Center',
      city_name: 'BENGALURU',
      Employee: 'praveen Kumar  - DP40699'
    }
 */
const prepareEcommPulledData = (ecommDict) => {
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
    const reasonCodeReturnCode = checkReasonCodeAndReturnCodeMapper(ecommDict);

    if (_.isEmpty(reasonCodeReturnCode)) {
      return pickrrEcommDict;
    }

    const reasonDict = reasonCodeReturnCode.codeMapper;
    const pickrrStatusCode = reasonDict.pickrr_status_code;
    const scanType = pickrrStatusCode === "UD" ? "NDR" : pickrrStatusCode;
    const pickrrSubstatusCode = reasonDict.pickrr_sub_status_code;

    let scanDatetime = moment(ecommDict.updated_on.trim(), "DD MMM, YYYY, HH:mm");
    scanDatetime = scanDatetime.isValid()
      ? scanDatetime.format("YYYY-MM-DD HH:mm:ss")
      : ecommDict.updated_on;

    let eddStamp = moment(ecommDict.edd, "DD-MMM-YYYY");
    eddStamp = eddStamp.isValid() ? eddStamp.format("YYYY-MM-DD HH:mm:ss") : "";

    let pickupDate = moment(ecommDict.pickupdate, "DD-MMM-YYYY");
    pickupDate = pickupDate.isValid() ? pickupDate.format("YYYY-MM-DD HH:mm:ss") : "";

    pickrrEcommDict.scan_datetime = scanDatetime || "";
    pickrrEcommDict.EDD = eddStamp || "";
    let remarks = `${ecommDict.status.trim()} ${ecommDict.reason_code?.replace("-", "")?.trim()}`;

    if (scanType === "RTD") {
      remarks = "Order Returned to Consignee";
    }
    if (scanType === "RTO") {
      remarks = "Order Returned Back";
    }

    pickrrEcommDict.scan_type = scanType;
    pickrrEcommDict.track_info = remarks;
    pickrrEcommDict.awb = ecommDict.trackingId;
    pickrrEcommDict.track_location = _.get(ecommDict, "city", "");
    pickrrEcommDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType];
    pickrrEcommDict.pickrr_sub_status_code = pickrrSubstatusCode;
    pickrrEcommDict.courier_status_code = reasonCodeReturnCode.codeNumber;

    if (scanType === "PP" || pickupDate) {
      pickrrEcommDict.pickup_datetime = pickupDate || scanDatetime;
    }

    // TODO: change scanType if returnWaybill exists

    return pickrrEcommDict;
  } catch (error) {
    pickrrEcommDict.err = error;
    return pickrrEcommDict;
  }
};

module.exports = {
  prepareEcommData,
  prepareEcommPulledData,
};

const moment = require("moment");
const _ = require("lodash");

const logger = require("../../../../logger");
const {
  NAAPTOL_STATUS_CODE_TO_STATUS_MAPS,
  NAAPTOL_STATUS_DESCRIPTION_MAPPING,
  NAAPTOL_STATUS_MAPPING,
} = require("./constants");

/**
 *
 * @param {*} trackResponse
 */
const createNaaptolTrackingJson = (trackResponse) => {
  try {
    const naaptolTrackingJson = {
      AWBNo: "",
      orderNumber: "",
      declaredValue: "",
      payMode: "",
      codAmount: "",
      originCity: "",
      destinationCity: "",
      destinationPincode: "",
      noOfAttempt: "",
      expectedDeliverydate: "",
      shipmenttype: "",
      scanDateTime: "",
      scannedLocation: "",
      status: "",
      scanCode: "",
      remark: "",
    };
    const currentStatusDict = trackResponse.status || {};
    let currentStatusDatetime = currentStatusDict.current_status_time;
    if (moment(currentStatusDatetime).isValid()) {
      currentStatusDatetime = moment(currentStatusDatetime).format("YYYY-MM-DD HH:mm:ss");
    }

    let expectedDeliveryDate = trackResponse.edd_stamp;
    if (moment(expectedDeliveryDate).isValid()) {
      expectedDeliveryDate = moment(expectedDeliveryDate).format("YYYY-MM-DD");
    }

    let reasonCode = "";
    let attemptCount = 0;
    let isRto = false;
    let rtoComment = "";
    let pickrrSubStatusCode = "";

    let statusType = currentStatusDict.current_status_type || "";
    let currentStatus = currentStatusDict.current_status_body || "";
    let statusDescription = NAAPTOL_STATUS_DESCRIPTION_MAPPING[statusType];

    if (trackResponse.track_arr) {
      const { track_arr: trackArr } = trackResponse;
      const trackArrReverse = _.cloneDeep(trackArr);
      _.reverse(trackArrReverse);
      let currentlyNdr = false;

      trackArrReverse.forEach((trackItem) => {
        const { scan_type: scanType } = trackItem;
        if (["NDR", "UD"].includes(scanType)) {
          currentlyNdr = true;
          reasonCode = trackItem.scan_status;
          pickrrSubStatusCode = trackItem.pickrr_sub_status_code || "";
        } else {
          reasonCode = "";
        }

        if (scanType === "OO") {
          attemptCount += 1;
        }
        if (["RTO", "RTO-OO", "RTO-OT"].includes(scanType)) {
          isRto = true;
          rtoComment = trackItem.scan_status;
        }
      });
      if (!["DL", "RTO", "RTD"].includes(statusType) && currentlyNdr) {
        statusType = "NDR";
        currentStatus = "Failed Attempt at Delivery";
        statusDescription = reasonCode;
      }
    }

    if (["NDR", "UD"].includes(statusType)) {
      const subStatus = pickrrSubStatusCode;
      if (!subStatus) {
        currentStatus = "Undelivered";
        statusType = "NDR";
        statusDescription = NAAPTOL_STATUS_DESCRIPTION_MAPPING.NDR;
      } else {
        statusType = subStatus;
        currentStatus = NAAPTOL_STATUS_CODE_TO_STATUS_MAPS[subStatus] || "Undelivered";
        statusDescription =
          NAAPTOL_STATUS_DESCRIPTION_MAPPING[subStatus] || "Undelivered- Other Reasons";
      }
    } else {
      currentStatus = NAAPTOL_STATUS_MAPPING[statusType] || "";
    }

    const infoDict = trackResponse.info || {};
    const price = infoDict.invoice_value || 0;

    naaptolTrackingJson.AWBNo = trackResponse.courier_tracking_id || trackResponse.tracking_id;
    naaptolTrackingJson.orderNumber =
      trackResponse.client_order_id || trackResponse.pickrr_order_id;
    naaptolTrackingJson.declaredValue = price;
    naaptolTrackingJson.payMode = trackResponse.is_cod ? "C" : "P";
    naaptolTrackingJson.codAmount = !trackResponse.is_cod ? 0 : price;
    naaptolTrackingJson.originCity = infoDict.from_city || "";
    naaptolTrackingJson.destinationCity = infoDict.to_city || "";
    naaptolTrackingJson.destinationPincode = infoDict.to_pincode || "";
    naaptolTrackingJson.noOfAttempt = attemptCount;
    naaptolTrackingJson.expectedDeliverydate = expectedDeliveryDate;
    naaptolTrackingJson.shipmenttype = trackResponse.is_reverse ? "R" : "F";
    naaptolTrackingJson.scanDateTime = currentStatusDatetime;
    naaptolTrackingJson.scannedLocation = currentStatusDict.current_status_location;
    naaptolTrackingJson.status = currentStatus;
    naaptolTrackingJson.scanCode = statusType;
    naaptolTrackingJson.remark = statusDescription;

    if (isRto) {
      naaptolTrackingJson.rtoAWBNumber =
        trackResponse.courier_tracking_id || trackResponse.tracking_id;
      naaptolTrackingJson.rtoRemark = rtoComment;
    }
    return naaptolTrackingJson;
  } catch (error) {
    logger.error("createNaaptolTrackingJson", error);
    return {};
  }
};

module.exports = createNaaptolTrackingJson;

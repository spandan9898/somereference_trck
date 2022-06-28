const moment = require("moment");
const _ = require("lodash");

const { BLOCK_NDR_STRINGS } = require("./constants");
const { mapStatusToEvent } = require("./helpers");
const logger = require("../../../logger");

/**
 *@param {*} trackObj : same as above example
 * preparing track data for pull db update
 */
const prepareTrackDataToUpdateInPullDb = (trackObj, isFromPulled) => {
  const trackData = _.cloneDeep(trackObj);
  const {
    scan_type: scanType = "",
    track_info: trackInfo = "",
    scan_datetime: scanDatetime = "",
    track_location: trackLocation = "",
    EDD: edd = "",
    pickrr_sub_status_code: pickrrSubStatusCode = "",
    courier_status_code: courierStatusCode = "",
    received_by: receivedBy = "",
    pickup_datetime: pickupDatetime = "",
  } = trackData;

  if (scanType === "CC") {
    return {
      success: false,
      err: "scanType is CC",
    };
  }

  if (trackInfo.toLowerCase() in BLOCK_NDR_STRINGS && scanType === "NDR") {
    trackData.scan_type = "OT";
  }
  const currentStatusTime = scanDatetime;

  // currentStatusTime = currentStatusTime.isValid() ? currentStatusTime.format() : null;

  const statusMap = {
    "status.current_status_time": moment(currentStatusTime).subtract(330, "m").toDate(),
    "status.current_status_type": scanType,
    "status.current_status_body": trackInfo,
    "status.current_status_location": trackLocation,
    "status.pickrr_sub_status_code": pickrrSubStatusCode,
    "status.courier_status_code": courierStatusCode,
    "status.current_status_val": null,
    "status.received_by": receivedBy,
  };

  const eventObj = mapStatusToEvent(statusMap);
  eventObj.pickrr_sub_status_code = trackData.pickrr_sub_status_code;
  eventObj.courier_status_code = trackData.courier_status_code;
  eventObj.update_source = isFromPulled ? "kafka_pull" : "kafka";
  eventObj.update_time = moment().toDate();
  eventObj.system_updated_at = moment().toDate();
  if (trackData?.otp_remarks) {
    eventObj.otp_remarks = trackData.otp_remarks;
  }
  if (pickupDatetime) {
    eventObj.pickup_datetime = moment(pickupDatetime).subtract(330, "m").toDate();
  }

  let eddStamp;
  if (edd) {
    const eddDate = moment(edd);
    eddStamp = eddDate.isValid() ? eddDate.subtract(330, "m").toDate() : edd;
    try {
      const isBefore = moment(eddStamp).isBefore(moment(), "year");
      if (isBefore) {
        eddStamp = "";
      }
    } catch (error) {
      eddStamp = "";
      logger.error("Edd Date Issue", error);
    }
  } else {
    eddStamp = edd;
  }
  return {
    success: true,
    eddStamp,
    eventObj,
    statusMap,
    awb: trackData.awb,
  };
};

module.exports = {
  prepareTrackDataToUpdateInPullDb,
};

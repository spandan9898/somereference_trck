const _ = require("lodash");
const moment = require("moment");
const { PIDGE_CODE_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const logger = require("../../../logger");

/**
 *
 * @param {*} pidegDict
 * sample payload --> {
    
    "vendor_order_id": "13535955",
    "reference_id": "13535955",
    "trip_id": 679158,
    "trip_type": 3,
    "trip_status": 190,
    "flow_type": {
        "name": "hyperlocal regular",
        "code": 1
    },
    "timestamp": "2021-05-02T02:16:55.908Z", __> scan_datetime (already in utc)
    "attempt_type": 10,
    "remarks": null,
    "rider_name": "Mohd  Furqan",
    "PBID": 369062, --> awb
    "brand": {
        "code": "XYZ",
        "location_code": "dl",
        "name": "XYZ-Most popular brand"
    },
    "status": 11  
}
 */
const preparePidgeData = (pidgeDict) => {
  const pickrrPidgeDict = {
    awb: "", // PBID
    scan_type: "", //
    scan_datetime: "",
    track_info: "", // same as pickrr_status
    track_location: "", // always empty
    received_by: "", // always empty
    pickup_datetime: "", // first PP datetime (OTE --> seeing empty in all other couriers)
    EDD: "", // empty
    pickrr_status: "", //
    pickrr_sub_status_code: "",
    courier_status_code: "", // status_remarks if remarks present else status
  };
  try {
    pickrrPidgeDict.awb = _.get(pidgeDict, "PBID", "").toString();
    let statusString = null;
    if (!pidgeDict?.timestamp) {
      logger.info(`Timestamp not found on ${pickrrPidgeDict.awb} waybill`);
      return { err: `Timestamp not found on ${pickrrPidgeDict.awb} waybill` };
    }
    if (pidgeDict?.status) {
      if ([13, 12, 21].includes(pidgeDict.status)) {
        statusString = pidgeDict?.remarks
          ? `${pidgeDict.status}_${pidgeDict.remarks}`
          : pidgeDict.status.toString();
      } else {
        statusString = pidgeDict.status.toString();
      }
    }
    if (!statusString) {
      return {};
    }
    const scanType = PIDGE_CODE_MAPPER[statusString.toLowerCase()];
    if (!scanType) {
      return { err: "Unknown status code" };
    }
    const scanDatetime = moment(pidgeDict.timestamp)
      .add(330, "minute")
      .format("YYYY-MM-DD HH:mm:ss");
    pickrrPidgeDict.scan_datetime = scanDatetime;
    pickrrPidgeDict.courier_status_code = statusString;
    pickrrPidgeDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
    pickrrPidgeDict.track_info = pidgeDict?.remarks
      ? `${PICKRR_STATUS_CODE_MAPPING[pickrrPidgeDict.scan_type]} - ${pidgeDict?.remarks}`
      : PICKRR_STATUS_CODE_MAPPING[pickrrPidgeDict.scan_type];
    pickrrPidgeDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrPidgeDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    pickrrPidgeDict.rider_name = _.get(pidgeDict, "rider_name", "").toString();

    return pickrrPidgeDict;
  } catch (error) {
    pickrrPidgeDict.err = error.message;
    return pickrrPidgeDict;
  }
};

/**
 *
 * @param {*} pidgeDict
   sample payload --> {
   "trackingId" : "1204100",
   "event" : "pull",
   "isReverse" : false,
   "trip_status": 170,
   "status_datetime": "2022-04-27T03:29:38.287Z",
   "remarks": null,
   "status": null,
   "trip_id": 2842856,
   "attempt_type": 10
 * 
 * }
 */
const preparePidgePulledData = (pidgeDict) => {
  const pickrrPidgeDict = {
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
    const { trackingId, status, remarks = null, status_datetime: statusDatetime } = pidgeDict;
    if (!trackingId) {
      return {
        err: "Tracking ID not available",
      };
    }
    let statusString = null;
    if (status) {
      if (["13", "12", "21"].includes(status)) {
        statusString = remarks ? `${status}_${remarks}` : status.toString();
      } else {
        statusString = status.toString();
      }
    }

    if (!statusString) {
      return {};
    }

    const scanType = PIDGE_CODE_MAPPER[statusString.toLowerCase()];

    if (!scanType) {
      return { err: "Unknown status code" };
    }
    pickrrPidgeDict.awb = trackingId;
    const scanDatetime = moment(statusDatetime).add(330, "minute").format("YYYY-MM-DD HH:mm:ss");
    pickrrPidgeDict.scan_datetime = scanDatetime;
    pickrrPidgeDict.courier_status_code = statusString;
    pickrrPidgeDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
    pickrrPidgeDict.track_info = remarks
      ? `${PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type]} - ${remarks}`
      : PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrPidgeDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type] || "";
    pickrrPidgeDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    if (pickrrPidgeDict?.scan_type === "PP") {
      pickrrPidgeDict.pickup_datetime = pickrrPidgeDict?.scan_datetime;
    }
    return pickrrPidgeDict;
  } catch (error) {
    pickrrPidgeDict.err = error.message;
    return pickrrPidgeDict;
  }
};

module.exports = {
  preparePidgeData,
  preparePidgePulledData,
};

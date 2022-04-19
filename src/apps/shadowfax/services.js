const moment = require("moment");

const {
  SHADOWFAX_REVERSE_MAPPER,
  SHADOWFAX_PULL_CODE_MAPPER_1,
  SHADOWFAX_PULL_CODE_MAPPER_2,
} = require("./constant");
const { NEW_STATUS_TO_OLD_MAPPING } = require("../../services/v1/constants");

/**
 *
 * get Custom Scan Type for ShdadowFax
 *
 */
const getEventInfoData = ({ event, comments, statusId, remarks, isReverse }) => {
  let mapperString;
  let scanType;
  let pickrrSubStatusCode;
  const courierStatus = event || statusId;
  const courierRemark = comments || remarks;

  // ShadowFax Reverse Mapping is handled over here

  if (isReverse) {
    mapperString = courierStatus;
    if (["pickup_on_hold"].includes(courierStatus.toLowerCase())) {
      mapperString = `${courierStatus}_${courierRemark}`;
    }
    if (mapperString in SHADOWFAX_REVERSE_MAPPER) {
      scanType = SHADOWFAX_REVERSE_MAPPER[mapperString].scan_type;
      pickrrSubStatusCode = SHADOWFAX_REVERSE_MAPPER[mapperString].pickrr_sub_status_code;
      return { scanType, pickrrSubStatusCode, mapperString };
    }
    return {};
  }

  // ShadowFax Forward Mapping

  if (
    ["pickup_on_hold", "on_hold", "nc", "na", "recd_at_fwd_dc", "cancelled_by_customer"].includes(
      courierStatus.toLowerCase()
    )
  ) {
    mapperString = `${courierStatus}_${courierRemark}`;
    if (SHADOWFAX_PULL_CODE_MAPPER_1[mapperString.toLowerCase()]?.scan_type) {
      scanType = SHADOWFAX_PULL_CODE_MAPPER_1[mapperString.toLowerCase()]?.scan_type || "";
      pickrrSubStatusCode =
        SHADOWFAX_PULL_CODE_MAPPER_1[mapperString.toLowerCase()]?.pickrr_sub_status_code || "";
    }
    scanType = NEW_STATUS_TO_OLD_MAPPING[scanType] || scanType;
  } else if (courierStatus.toLowerCase() in SHADOWFAX_PULL_CODE_MAPPER_2) {
    mapperString = courierStatus;
    if (SHADOWFAX_PULL_CODE_MAPPER_2[mapperString.toLowerCase()]?.scan_type) {
      scanType = SHADOWFAX_PULL_CODE_MAPPER_2[mapperString.toLowerCase()]?.scan_type || "";
      pickrrSubStatusCode =
        SHADOWFAX_PULL_CODE_MAPPER_2[mapperString.toLowerCase()]?.pickrr_sub_status_code || "";
    }
  } else {
    return {};
  }
  return { scanType, mapperString, pickrrSubStatusCode };
};

/*
shadowfax courier payload --
    {
      "awb_number": "SF1234567890ABC",
      "event": "cancelled",
      "comments": "Cancelled By Customer",
      "event_timestamp": "2020-01-01 10:10:10",
      "order_id": "ABC1234567890",
      "client_id" : "01"
    }
*/

/**
 *Prepares PickrrData from Shadowfax's Pushed Info
 */
const prepareShadowfaxData = (shadowfaxDict) => {
  const pickrrShadowfaxDict = {
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
      awb_number: awb,
      event,
      comments,
      event_timestamp: eventTimeStamp,
      event_location: eventLocation,
    } = shadowfaxDict || {};

    pickrrShadowfaxDict.awb = awb;
    let isReverse = false;
    if (["R"].includes(awb[0])) {
      isReverse = true;
    }
    const { scanType, mapperString, pickrrSubStatusCode } = getEventInfoData({
      event,
      comments,
      isReverse,
    });
    if (!scanType) {
      return { err: "Scan type not found" };
    }
    pickrrShadowfaxDict.scan_type = scanType === "UD" ? "NDR" : scanType;
    pickrrShadowfaxDict.scan_datetime = moment(eventTimeStamp).format("YYYY-MM-DD HH:mm:ss");
    pickrrShadowfaxDict.track_info = comments;
    pickrrShadowfaxDict.track_location = eventLocation;
    pickrrShadowfaxDict.courier_status_code = mapperString;
    pickrrShadowfaxDict.pickrr_sub_status_code = pickrrSubStatusCode;
    return pickrrShadowfaxDict;
  } catch (error) {
    pickrrShadowfaxDict.err = error.message;
    return pickrrShadowfaxDict;
  }
};

/**
 *
 * @param {*} pulledData -> Check avsc
 * @desc prepare pulled data
 *
 */
const preparePulledShadowfaxData = (pulledData) => {
  const pickrrShadowfaxDict = {
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
      awb_number: awbNumber,
      created,
      location = "",
      remarks = "",
      status_id: statusId,
      received_by: receivedBy = "",
      edd = "",
    } = pulledData;

    const { scanType, mapperString, pickrrSubStatusCode } = getEventInfoData({ statusId, remarks });
    if (!scanType) {
      return { err: "Scan type not found" };
    }

    pickrrShadowfaxDict.awb = awbNumber;
    pickrrShadowfaxDict.scan_type = scanType;
    pickrrShadowfaxDict.scan_datetime = moment(created).toDate();
    pickrrShadowfaxDict.track_info = remarks;
    pickrrShadowfaxDict.track_location = location;
    pickrrShadowfaxDict.courier_status_code = mapperString;
    pickrrShadowfaxDict.pickrr_sub_status_code = pickrrSubStatusCode;
    pickrrShadowfaxDict.EDD = edd || "";
    if (scanType === "DL") {
      pickrrShadowfaxDict.received_by = receivedBy || "";
    }

    if (pickrrShadowfaxDict.scan_type === "PP") {
      pickrrShadowfaxDict.pickup_datetime = pickrrShadowfaxDict.scan_datetime;
    }
    return pickrrShadowfaxDict;
  } catch (error) {
    pickrrShadowfaxDict.err = error.message;
    return pickrrShadowfaxDict;
  }
};

module.exports = {
  prepareShadowfaxData,
  preparePulledShadowfaxData,
};

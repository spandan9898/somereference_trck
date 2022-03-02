const moment = require("moment");
const _ = require("lodash");

const {
  SHADOWFAX_CODE_MAPPER,
  SHADOWFAX_PULL_CODE_MAPPER_1,
  SHADOWFAX_PULL_CODE_MAPPER_2,
} = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { NEW_STATUS_TO_OLD_MAPPING } = require("../../services/v1/constants");

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
 *
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
    const { event, received_by: receivedBy, EDD } = shadowfaxDict || {};
    if (event.toLowerCase() in SHADOWFAX_CODE_MAPPER) {
      const scanType = SHADOWFAX_CODE_MAPPER[event.toLowerCase()];
      const scanDatetime = moment(shadowfaxDict.event_timestamp).format("YYYY-MM-DD HH:mm:ss");
      pickrrShadowfaxDict.EDD = EDD ? moment(EDD).format("YYYY-MM-DD HH:mm:ss") : "";
      pickrrShadowfaxDict.received_by = receivedBy || "";
      pickrrShadowfaxDict.scan_type = scanType;
      pickrrShadowfaxDict.scan_datetime = scanDatetime;
      pickrrShadowfaxDict.track_info = _.get(shadowfaxDict, "comments", "");
      pickrrShadowfaxDict.awb = _.get(shadowfaxDict, "awb_number", "");
      pickrrShadowfaxDict.track_location = _.get(shadowfaxDict, "location", "");
      pickrrShadowfaxDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType];
    }
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

    const trackDetails = {};

    let scanType;
    let pickrrSubStatusCode;
    let mapperString;

    if (
      ["pickup_on_hold", "on_hold", "nc", "na", "recd_at_fwd_dc"].includes(statusId.toLowerCase())
    ) {
      mapperString = `${statusId}_${remarks}`;
      if (SHADOWFAX_PULL_CODE_MAPPER_1[mapperString.toLowerCase()]?.scan_type) {
        scanType = SHADOWFAX_PULL_CODE_MAPPER_1[mapperString.toLowerCase()]?.scan_type || "";
        pickrrSubStatusCode =
          SHADOWFAX_PULL_CODE_MAPPER_1[mapperString.toLowerCase()]?.pickrr_sub_status_code || "";
      }

      scanType = NEW_STATUS_TO_OLD_MAPPING[scanType] || scanType;
    } else if (statusId.toLowerCase() in SHADOWFAX_PULL_CODE_MAPPER_2) {
      mapperString = statusId;
      if (SHADOWFAX_PULL_CODE_MAPPER_2[mapperString.toLowerCase()]?.scan_type) {
        scanType = SHADOWFAX_PULL_CODE_MAPPER_2[mapperString.toLowerCase()]?.scan_type || "";
        pickrrSubStatusCode =
          SHADOWFAX_PULL_CODE_MAPPER_2[mapperString.toLowerCase()]?.pickrr_sub_status_code || "";
      }
      scanType = NEW_STATUS_TO_OLD_MAPPING[scanType] || scanType;
    } else {
      return pickrrShadowfaxDict;
    }

    if (!scanType) {
      // TODO: SET a logger

      return pickrrShadowfaxDict;
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

    if (trackDetails.scan_type === "PP") {
      pickrrShadowfaxDict.pickup_datetime = trackDetails.scan_datetime;
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

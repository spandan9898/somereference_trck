const moment = require("moment");

const { SHADOWFAX_CODE_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

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
    const { event, received_by: receivedBy } = shadowfaxDict || {};
    if (event in SHADOWFAX_CODE_MAPPER) {
      const scanType = SHADOWFAX_CODE_MAPPER[event];
      const scanDatetime = moment(shadowfaxDict.event_timestamp).format("YYYY-MM-DD HH-MM-SS");
      if (shadowfaxDict.EDD) {
        pickrrShadowfaxDict.EDD = moment(shadowfaxDict.EDD).format("YYYY-MM-DD HH-MM-SS");
      }
      if (receivedBy) {
        pickrrShadowfaxDict.received_by = receivedBy;
      }
      pickrrShadowfaxDict.scan_type = scanType;
      pickrrShadowfaxDict.scan_datetime = scanDatetime;
      pickrrShadowfaxDict.track_info = shadowfaxDict.comments;
      pickrrShadowfaxDict.awb = shadowfaxDict.awb_number;
      pickrrShadowfaxDict.track_location =
        "location" in shadowfaxDict ? shadowfaxDict.location : "";
      pickrrShadowfaxDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType];
    }
    return pickrrShadowfaxDict;
  } catch (error) {
    pickrrShadowfaxDict.err = error.message;
    return pickrrShadowfaxDict;
  }
};

module.exports = {
  prepareShadowfaxData,
};

const moment = require("moment");
const _ = require("lodash");

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

module.exports = {
  prepareShadowfaxData,
};

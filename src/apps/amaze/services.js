const moment = require("moment");
const _ = require("lodash");

const { AMAZE_CODE_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/*
    Request Payload Sample
    ```json
    {
        "awb": "AWBNUMBER",
        "current_status": "Undelivered",
        "updatedBy": "Azadpur",
        "location": "Azadpur",
        "updatedAt": "2021-05-31 09:47:11",
        "remarks": "COD Not Ready"
    }
*/

/**
 *
 * @param {*} amazeDict
 * @returns
 */
const prepareAmazeData = (amazeDict) => {
  const pickrrAmazeDict = {
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
    const currentStatus = amazeDict.current_status;

    let remarks = "";
    remarks = _.get(amazeDict, "remarks", "");
    let mappingKey = currentStatus;
    if (currentStatus === "Undelivered" && remarks) {
      mappingKey = `${currentStatus}-${remarks}`;
    }

    const scanMappingItem = AMAZE_CODE_MAPPER[mappingKey.toLowerCase()];
    if (!scanMappingItem) {
      return {
        err: `Unknown status code ${mappingKey}`,
      };
    }

    pickrrAmazeDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanMappingItem?.scan_type] || "";

    const scanType = scanMappingItem.scan_type;
    const scanDatetime = amazeDict.updatedAt
      ? moment(amazeDict.updatedAt).format("YYYY-MM-DD HH:mm:ss")
      : "";

    pickrrAmazeDict.EDD = amazeDict.edd ? moment(amazeDict.edd).format("YYYY-MM-DD HH:mm:ss") : "";

    pickrrAmazeDict.received_by = amazeDict.received_by || "";

    pickrrAmazeDict.scan_type = scanType;
    pickrrAmazeDict.scan_datetime = scanDatetime;
    pickrrAmazeDict.track_info = amazeDict.current_status;
    pickrrAmazeDict.awb = amazeDict.awb;
    pickrrAmazeDict.track_location = amazeDict.location;
    pickrrAmazeDict.courier_status_code = scanMappingItem;
    pickrrAmazeDict.pickrr_sub_status_code = scanMappingItem.pickrr_sub_status_code;
    if (pickrrAmazeDict.scan_type.toString() === "PP") {
      const pickupDatetime = scanDatetime;
      pickrrAmazeDict.pickup_datetime = pickupDatetime;
    }
    return pickrrAmazeDict;
  } catch (error) {
    return { err: error };
  }
};

module.exports = {
  prepareAmazeData,
};

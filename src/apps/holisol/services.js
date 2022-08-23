const moment = require("moment");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { PULL_MAPPER } = require("./constant");
const logger = require("../../../logger");
const { CODE_MAPPER } = require("../loadshare/constant");

/**
 *
 * @param
 * {
 *  isRto: true/false,
 *  trackingId : "19359r31r590",
 *  event : "pull",
 *  isReverse : false/true,
 *  city(City) : '',
 *  message (Message) : '',
 *  createdAt : '',
 *  serialNo : '',
 *  ndrCode : '',
 *  awb : '',
 * } holisolDict
 */
const preparePulledHolisolData = (holisolDict) => {
  const pickrrHolisolDict = {
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
    if (!holisolDict?.awb) {
      return { err: "Tracking ID not available" };
    }
    let mapperString = holisolDict?.serialNo.toString();
    if (mapperString === "7") {
      mapperString = holisolDict?.ndrCode
        ? `${holisolDict?.serialNo}_${holisolDict?.ndrCode}`
        : `${holisolDict?.serialNo}`;
    }
    if (!mapperString) {
      return { err: "mapper String doesn't exist" };
    }
    const scanType = CODE_MAPPER[mapperString.toLowerCase()];
    if (holisolDict?.isRto) {
      if (scanType?.scan_type === "DL") {
        scanType.scan_type = "RTD";
      } else if (scanType?.scan_type === "OO") {
        scanType.scan_type = "RTO-00";
      } else {
        scanType.scan_type = "RTO-OT";
      }
    }

    return pickrrHolisolDict;
  } catch (error) {
    pickrrHolisolDict.err = error.message;
    return pickrrHolisolDict;
  }
};

module.exports = {
  preparePulledHolisolData,
};

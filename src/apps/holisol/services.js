const moment = require("moment");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { PULL_MAPPER } = require("./constant");
const logger = require("../../../logger");

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
    const scanType = PULL_MAPPER[mapperString.toLowerCase()];
    if (!scanType) {
      logger.error(`Holisol Preparator Error --> ${mapperString}`);
      return { err: "scanType doesn't exist!" };
    }
    if (holisolDict?.isRto) {
      if (scanType?.scan_type === "DL") {
        scanType.scan_type = "RTD";
      } else if (scanType?.scan_type === "OO") {
        scanType.scan_type = "RTO-OO";
      } else {
        scanType.scan_type = "RTO-OT";
      }
    }
    pickrrHolisolDict.scan_type = scanType?.scan_type === "UD" ? "NDR" : scanType?.scan_type;
    pickrrHolisolDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    let statusDate = moment(holisolDict?.createdAt, "M/DD/YYYY LTS");
    statusDate = statusDate.isValid()
      ? statusDate.format("YYYY-MM-DD HH:mm:ss.SSS")
      : moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    pickrrHolisolDict.scan_datetime = statusDate;
    if (pickrrHolisolDict?.scan_type === "PP") {
      pickrrHolisolDict.pickup_datetime = pickrrHolisolDict?.scan_datetime;
    }
    let eddDate = moment(holisolDict?.expectedDOD, "M/DD/YYYY LTS");
    eddDate = eddDate.isValid() ? eddDate.format("YYYY-MM-DD HH:mm:ss") : "";
    pickrrHolisolDict.EDD = eddDate;
    pickrrHolisolDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[pickrrHolisolDict?.scan_type];
    pickrrHolisolDict.track_location = holisolDict?.city;
    pickrrHolisolDict.track_info = holisolDict?.message || pickrrHolisolDict?.pickrr_status;
    pickrrHolisolDict.awb = holisolDict?.trackingId;
    pickrrHolisolDict.courier_status_code = mapperString.toLowerCase();
    return pickrrHolisolDict;
  } catch (error) {
    pickrrHolisolDict.err = error.message;
    return pickrrHolisolDict;
  }
};

const payload = {
  trackingId: "HL5474332019",
  event: "pull",
  isReverse: false,
  isRto: false,
  expectedDOD: "9/3/2022 1:00:37 PM",
  awb: "HL5474332019",
  message: "Shipment delivered  ",
  createdAt: "8/25/2022 2:24:00 PM",
  city: "BANGALORE",
  serialNo: "6",
  ndrCode: "",
};

console.log(preparePulledHolisolData(payload));

module.exports = {
  preparePulledHolisolData,
};

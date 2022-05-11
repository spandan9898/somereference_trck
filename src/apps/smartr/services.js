const moment = require("moment");
const logger = require("../../../logger");
const { PULL_MAPPER, STATION_MAPPER } = require("./constant");

/**
 *
 * prepare Smartr Pulled Data
 */
const preparePulledSmartrData = (smartrDict) => {
  const pickrrSmartrDict = {
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
    pickrrSmartrDict.awb = smartrDict.AwbNumber;
    let mapperString = smartrDict.Milestone;
    const { DeliveryAttemptDetails, isRto, Station, eventdatetime } = smartrDict;
    if (mapperString.toLowerCase() === "delivery attempt" && smartrDict?.DeliveryAttemptDetails) {
      mapperString = `${mapperString}_${DeliveryAttemptDetails}`;
    }
    const statusMappedData = PULL_MAPPER[mapperString.toLowerCase()];
    if (!statusMappedData) {
      return {
        err: "No Scan Type Found",
      };
    }
    const { scanType } = statusMappedData;
    pickrrSmartrDict.scan_type = scanType;

    if (isRto) {
      if (scanType === "DL") {
        pickrrSmartrDict.scan_type = "RTD";
      } else if (scanType === "OO") {
        pickrrSmartrDict.scan_type = "RTO-OO";
      } else {
        pickrrSmartrDict.scan_type = "RTO-OT";
      }
    }
    pickrrSmartrDict.pickrr_sub_status_code = statusMappedData.pickrr_sub_status_code;
    const stationMappedData = STATION_MAPPER[Station.toLowerCase()];
    if (Station && stationMappedData) {
      pickrrSmartrDict.track_location = stationMappedData;
    }
    let scanTime = moment(eventdatetime, "DD/MM/YYYYT hh:mm").toDate();
    scanTime = scanTime.format("YYYY-MM-DDTHH:mm");
    if (scanType === "PP") {
      pickrrSmartrDict.pickup_datetime = scanTime;
    }
    pickrrSmartrDict.scan_datetime = scanTime;
    return pickrrSmartrDict;
  } catch (error) {
    logger.error("Failed While preparing Pickrr Dict for Smartr", error.message);
    return {};
  }
};

module.exports = {
  preparePulledSmartrData,
};

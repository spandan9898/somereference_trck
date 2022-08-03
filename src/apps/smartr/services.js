const moment = require("moment");
const logger = require("../../../logger");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { PULL_MAPPER, STATION_MAPPER } = require("./constant");

/**
 *
 * prepare Smartr Pulled Data
 * Sample Payload : {
  AWBNumber: 'XSE-13107835',
  Station: 'HSRL',
  Milestone: 'Booked',
  Pieces: 1,
  PiecesWeight: '0.30 Kgs',
  UOM: 'K',
  FlightNo: ' 13/05/2022 ',
  FlightDate: '13/05/2022 14:55',
  Origin: 'HSRL',
  OriginAirportName: 'HSR LAYOUT BANGALORE',
  Destination: 'BLRH',
  DestAirportName: 'BENGALURU HUB',
  ULDNO: '',
  OrderBy: 1,
  eventdatetime: '13/05/2022 14:55',
  isRto: false,
  event: 'pull'
}
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
    pickrrSmartrDict.awb = smartrDict.AWBNumber;
    let mapperString = smartrDict.Milestone;
    const { DeliveryAttemptDetails, isRto, Station, eventdatetime } = smartrDict;
    if (mapperString.toLowerCase() === "delivery attempt" && DeliveryAttemptDetails) {
      mapperString = `${mapperString}_${DeliveryAttemptDetails}`;
    }
    const statusMappedData = PULL_MAPPER[mapperString.toLowerCase()];
    if (!statusMappedData) {
      return {
        err: "No Scan Type Found",
      };
    }
    const { scan_type: scanType } = statusMappedData;
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
    const stationMappedData = STATION_MAPPER[Station.toUpperCase()];
    if (Station && stationMappedData) {
      pickrrSmartrDict.track_location = stationMappedData;
    }
    let scanTime = eventdatetime ? moment(eventdatetime, "DD/MM/YYYY hh:mm") : "";
    scanTime = moment(scanTime).isValid ? scanTime.format("YYYY-MM-DD HH:mm") : "";
    if (scanType === "PP") {
      pickrrSmartrDict.pickup_datetime = scanTime;
    }
    pickrrSmartrDict.scan_datetime = scanTime;
    pickrrSmartrDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[pickrrSmartrDict.scan_type];
    return pickrrSmartrDict;
  } catch (error) {
    logger.error("Failed While preparing Pickrr Dict for Smartr", error.message);
    return {};
  }
};

module.exports = {
  preparePulledSmartrData,
};

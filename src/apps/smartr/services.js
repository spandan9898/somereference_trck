const _ = require("lodash");
const moment = require("moment");
const logger = require("../../../logger");
const { PULL_MAPPER, CODE_MAPPER, STATION_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**
 *
 * @param {*} smartrDict
 * {
    {
      country=India, 
      status_description=Returned to Shipper, 
      awb_number=20270891, 
      status_code=RTS, 
      pod=, 
      city=DELH, 
      order_number=66042700, 
      status_update_number=XSE-10845613, 
      weight=0.1, 
      ref_awb=XSE-21153845, 
      otp_delivery=, 
      long=0.0000000,
      pieces=1.0, 
      delivery_agent=, 
      courier_code=Smart Express, 
      event_datetime=2022-07-06T19:44:10, 
      location=DELH, 
      state=, 
      reasonCode=, 
      lat=0.0000000, 
      remarks=
    }

 * }
 */
const prepareSmartrData = (smartrDict) => {
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
  pickrrSmartrDict.awb = _.get(smartrDict, "awb_number", "").toString();
  let mapperString = "";
  if (smartrDict?.status_code) {
    mapperString = smartrDict.status_code.toString();
    if (mapperString === "PKF" || mapperString === "SUD") {
      // PKF --> pickup failed, SUD --> undelivered

      mapperString = smartrDict?.reasonCode
        ? `${mapperString}_${smartrDict.reasonCode}`
        : mapperString;
    }
  }
  if (!mapperString) {
    return {};
  }
  const scanType = CODE_MAPPER[mapperString.toLowerCase()];
  if (!scanType) {
    return { err: "Unknown status code" };
  }

  let statusDate = moment(smartrDict?.event_datetime, "YYYY-MM-DD HH:mm:ss");
  statusDate = statusDate.isValid()
    ? statusDate.format("YYYY-MM-DD HH:mm:ss.SSS")
    : moment().format("YYYY-MM-DD HH:mm:ss.SSS");
  if (scanType?.scan_type === "PP") {
    pickrrSmartrDict.pickup_datetime = statusDate;
  }
  pickrrSmartrDict.scan_datetime = statusDate;
  pickrrSmartrDict.courier_status_code = mapperString;
  pickrrSmartrDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
  pickrrSmartrDict.track_info = smartrDict?.remarks
    ? `${smartrDict?.status_description} - ${smartrDict?.remarks}`
    : `${smartrDict?.status_description}`;
  pickrrSmartrDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
  pickrrSmartrDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
  pickrrSmartrDict.track_location =
    STATION_MAPPER[smartrDict?.location.toString()] || smartrDict?.location.toString();

  return pickrrSmartrDict;
};

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
    pickrrSmartrDict.track_info = PICKRR_STATUS_CODE_MAPPING[scanType] || "";
    pickrrSmartrDict.scan_datetime = scanTime;
    pickrrSmartrDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[pickrrSmartrDict.scan_type];
    pickrrSmartrDict.courier_status_code = mapperString;
    return pickrrSmartrDict;
  } catch (error) {
    logger.error("Failed While preparing Pickrr Dict for Smartr", error.message);
    return {};
  }
};

module.exports = {
  preparePulledSmartrData,
};

module.exports = {
  prepareSmartrData,
};

const _ = require("lodash");
const moment = require("moment");
const { CODE_MAPPER, STATION_MAPPER } = require("./constant");
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

  let statusDate = moment(smartrDict?.eventTime, "YYYY-MM-DD HH:mm:ss");
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
module.exports = {
  prepareSmartrData,
};

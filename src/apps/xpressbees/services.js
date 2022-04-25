const _ = require("lodash");

const moment = require("moment");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const {
  XBS_STATUS_MAPPER,
  XBS_NDR_MAPPER,
  XBS_REVERSE_MAPPER,
  XBS_PULL_MAPPER,
} = require("./constant");

/*
  :param xbs_dict: {
            "AWBNO" : "1332921569369",
            "StatusCode" : "UD",
            "Remarks" : "68",
            "StatusDate" : "12-05-2021",
            "StatusTime" : "1344",
            "CurrentLocation" : "JAI/SNG, JAIPUR, RAJASTHAN",
            "EDD" : "10-05-2021"
        }
      :return: {
          "awb":
          "scan_type":
          "scan_datetime": datetime.strptime(date, "%d-%m-%Y %H%M")
          "track_info":
          "track_location":
          "received_by":
          "pickup_datetime":
          "EDD":
          "pickrr_status":
          "pickrr_sub_status_code":
          "courier_status_code":
      }
*/

/**
 *
 * Preparing pickrr dict from xpressees request payload
 */
const prepareXbsData = (xbsDict) => {
  const pickrrXbsDict = {
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
    const trackData = { ...xbsDict };
    const { StatusCode = "", Remarks = "" } = trackData;
    const statusScanType = `${Remarks}-${StatusCode}`;
    const statusDateTime = `${trackData.StatusDate} ${trackData.StatusTime}`;

    const statusDate = statusDateTime
      ? moment(statusDateTime, "DD-MM-YYYY hhm").format("YYYY-MM-DD HH:mm:ss")
      : moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    if ("EDD" in trackData) {
      let eddDatetime = trackData.EDD;
      if (eddDatetime) {
        eddDatetime = moment(eddDatetime, "DD-MM-YYYY").format("YYYY-MM-DD");
      }
      pickrrXbsDict.EDD = eddDatetime;
    }
    if ("Receivedby" in trackData && trackData.Receivedby) {
      pickrrXbsDict.received_by = trackData.Receivedby;
    }
    const xbsMapper = { ...XBS_STATUS_MAPPER, ...XBS_REVERSE_MAPPER };
    const reasonDict = xbsMapper[statusScanType.toLowerCase()];

    if (!reasonDict) {
      return {
        err: "Unknown status code",
      };
    }
    const xbsNdrMapper = { ...XBS_REVERSE_MAPPER, ...XBS_NDR_MAPPER };
    const statusType = reasonDict.scan_type;
    pickrrXbsDict.scan_type = statusType === "UD" ? "NDR" : statusType;
    pickrrXbsDict.scan_datetime = statusDate;
    pickrrXbsDict.track_info =
      statusType === "UD"
        ? xbsNdrMapper[reasonDict?.pickrr_sub_status_code]
        : PICKRR_STATUS_CODE_MAPPING[statusType];
    pickrrXbsDict.awb = trackData.AWBNO;
    pickrrXbsDict.track_location = trackData.CurrentLocation;
    pickrrXbsDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[statusType];
    pickrrXbsDict.pickrr_sub_status_code = reasonDict?.pickrr_sub_status_code || "";
    pickrrXbsDict.courier_status_code = statusScanType;

    return pickrrXbsDict;
  } catch (error) {
    pickrrXbsDict.err = error.message;
    return pickrrXbsDict;
  }
};

/**
 *
 * prepares Pulled Xbs Data
 */
const preparePulledXBSData = (xbsDict) => {
  const pickrrXbsDict = {
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

  const mapperString = `${JSON.stringify(xbsDict.Status)}-${JSON.stringify(xbsDict.StatusCode)}`;
  const pickrrStatusInfo = XBS_PULL_MAPPER[mapperString.toLowerCase()];
  if (!pickrrStatusInfo.scan_type) {
    return {
      err: "No Pickrr Status Mapped to the current xbs Status",
    };
  }
  const xbsPickupScanTime =
    `${xbsDict.PickupTime.slice(0, 2)}:${xbsDict.PickupTime.slice(2, 4)}` || "";
  const xbsPickupDatetime = `${xbsDict.PickUpDate} ${xbsPickupScanTime}`;
  const xbsStatusTime = `${xbsDict.StatusTime.slice(0, 2)}:${xbsDict.StatusTime.slice(2, 4)}` || "";
  const xbsStatusDatetime = `${xbsDict.StatusDate} ${xbsStatusTime}`;

  // edd -->"4/10/2022 4:40:56 PM"
  /* splittedDate-- > ["4", "10", "2022 4:40:56 PM"];
    yearTimeSplit --- >  ["2022","4:40:56","PM"]
    yearmonthday ---> ["4","10","2022"]
    hourminutesec ---> ["4","40","56"]
  */
  const xbsEdd = xbsDict.ExpectedDeliveryDate;
  const spliteddate = xbsEdd.split("/");
  const yearTimeSplit = spliteddate[2].split(" ");

  const yearmonthday = [...spliteddate.slice(0, 2), ...yearTimeSplit.slice(0, 1)];
  const hourminutesec = yearTimeSplit[1].split(":");
  if (yearTimeSplit[2] === "PM") {
    hourminutesec[0] = JSON.stringify(parseInt(hourminutesec[0], 10) + 12);
  }
  const formattedEdd = `${_.reverse(yearmonthday).join("-")}T${hourminutesec.join(":")}`;

  pickrrXbsDict.awb = xbsDict.awbNumber;
  pickrrXbsDict.scan_type = pickrrStatusInfo.scan_type;
  pickrrXbsDict.track_location = xbsDict.Location;
  pickrrXbsDict.pickup_datetime = moment(xbsPickupDatetime).isValid()
    ? moment(xbsPickupDatetime).format("YYYY-MM-DD HH:mm:ss")
    : "";
  pickrrXbsDict.scan_datetime = moment(xbsStatusDatetime).isValid()
    ? moment(xbsStatusTime).format("YYYY-MM-DD HH:mm:ss")
    : "";
  pickrrXbsDict.pickrr_sub_status_code = pickrrStatusInfo.pickrr_sub_status_code || "";
  pickrrXbsDict.EDD = moment(formattedEdd).isValid()
    ? moment(formattedEdd).format("YYYY-MM-DD HH:mm:ss")
    : "";

  return pickrrXbsDict;
};

module.exports = { prepareXbsData, preparePulledXBSData };

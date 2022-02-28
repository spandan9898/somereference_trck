const moment = require("moment");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { XBS_STATUS_MAPPER, XBS_NDR_MAPPER, XBS_REVERSE_MAPPER } = require("./constant");

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
      statusType === "UD" ? xbsNdrMapper[reasonDict?.pickrr_sub_status_code] : PICKRR_STATUS_CODE_MAPPING[statusType];
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
module.exports = { prepareXbsData };

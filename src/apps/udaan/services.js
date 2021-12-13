const moment = require("moment");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { UDAAN_STATUS_MAPPING } = require("./constant");

/*
  udaan_dict: {
     "awbNumber":"xxxx",
     "status":"FW_DELIVERY_ATTEMPTED",
     "statusDescription":"Delivery attempted",
     "statusUpdateDate":"2021-05-06",
     "statusUpdateTime":"19:03:59",
     "comments":"Buyer not reachable over phone",
     "currentLocation":"Delhi",
     "deliveryAgentNumber":null,
     "rtoCode":null
  }

  return: {
      "awb":
      "scan_type":
      "scan_datetime": datetime.strptime(date, "%d-%m-%Y %H%M")
      "track_info":
      "track_location":
      "EDD":
  }
*/

/**
 *
 * Preparing pickrr dict from udaan request payload
 */
const prepareUdaanData = (udaanDict) => {
  const pickrrUdaanDict = {
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
    const trackData = { ...udaanDict };
    const { status = "", comments = "" } = trackData;
    const statusScanType = comments.length ? `${status}_${comments}` : status;
    const statusDateTime = `${trackData.statusUpdateDate} ${trackData.statusUpdateTime}`;
    const statusDate = statusDateTime
      ? moment(statusDateTime).format("YYYY-MM-DD HH:mm:ss")
      : moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    if ("eta" in trackData && trackData.eta) {
      let eddDatetime = trackData.eta;
      if (eddDatetime) {
        eddDatetime = moment(eddDatetime).format("YYYY-MM-DD HH:mm:ss");
      }
      pickrrUdaanDict.EDD = eddDatetime;
    }
    if ("received_by" in trackData && trackData.received_by) {
      pickrrUdaanDict.received_by = trackData.received_by;
    }
    const reasonDict = UDAAN_STATUS_MAPPING[statusScanType];

    if (!reasonDict) {
      return {
        err: "Unknown status code",
      };
    }
    const statusType = reasonDict.scan_type;

    pickrrUdaanDict.scan_type = statusType === "UD" ? "NDR" : statusType;
    pickrrUdaanDict.scan_datetime = statusDate;
    pickrrUdaanDict.track_info = trackData.statusDescription.toString();
    pickrrUdaanDict.awb = trackData.awbNumber.toString();
    pickrrUdaanDict.track_location = trackData.currentLocation.toString();
    pickrrUdaanDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[statusType];
    pickrrUdaanDict.pickrr_sub_status_code = reasonDict?.pickrr_sub_status_code || "";
    pickrrUdaanDict.courier_status_code = statusType;

    return pickrrUdaanDict;
  } catch (error) {
    pickrrUdaanDict.err = error.message;
    return pickrrUdaanDict;
  }
};

module.exports = { prepareUdaanData };

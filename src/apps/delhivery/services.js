const moment = require("moment");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { DELHIVERY_NSL_CODE_TO_STATUS_TYPE_MAPPER } = require("./constant");

/*
Request payload sample
    :param delhiveryDict: {
    "Shipment": {
        "Status": {
            "Status": "Manifested",
            "StatusDateTime": "2019-01-09T17:10:42.767",
            "StatusType": "UD",
            "StatusLocation": "Chandigarh_Raiprkln_C (Chandigarh)",
            "Instructions": "Manifest uploaded"
        },
        "PickUpDate": "2019-01-09T17:10:42.543",
        "NSLCode": "X-UCI",
        "Sortcode": "IXC/MDP",
        "ReferenceNo": "28",
        "AWB": "XXXXXXXXXXXX",
        "EDD": "2019-01-09T17:10:42.543",
        "Receivedby": "XXXX"
        }
    }
    :return: {
        "awb":
        "scan_type":
        "scan_datetime": datetime.strptime(date, "%d-%m-%Y %H%M")
        "track_info":
        "track_location":
        "EDD":
        "pickrr_status":
        "pickrr_sub_status_code":
        "courier_status_code":
    }
*/

/**
 *
 * Preparing pickrr dict from delhivery request payload
 *
 */
const prepareDelhiveryData = (delhiveryDict) => {
  const pickrrDelhiveryDict = {
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
    const trackData = delhiveryDict.Shipment;
    const statusScanType = trackData.Status.StatusType.toString();
    let statusType = statusScanType;
    const statusDateTime = trackData?.Status?.StatusDateTime;
    const statusDate = statusDateTime
      ? moment(statusDateTime).format("YYYY-MM-DD HH:MM:SS")
      : moment(new Date()).format("YYYY-MM-DD HH:MM:SS");

    if ("EDD" in trackData) {
      let eddDatetime = trackData.EDD;
      if (eddDatetime) {
        eddDatetime = moment(eddDatetime).format("YYYY-MM-DD HH:MM:SS");
      }
      pickrrDelhiveryDict.EDD = eddDatetime;
    }

    if ("Receivedby" in trackData && trackData.Receivedby) {
      pickrrDelhiveryDict.received_by = trackData.Receivedby;
    }

    if ("PickUpDate" in trackData) {
      const pickupDate = trackData.PickUpDate;
      let pickupDatetime;

      if (pickupDate) {
        pickupDatetime = moment(pickupDate).format("YYYY-MM-DD HH:MM:SS");
      }
      pickrrDelhiveryDict.pickup_datetime = pickupDatetime || pickupDate;
    }

    const nslCode = trackData.NSLCode;
    const delhiveryMapperKey = `${nslCode}_${statusScanType}`;
    const reasonDict = DELHIVERY_NSL_CODE_TO_STATUS_TYPE_MAPPER[delhiveryMapperKey];

    if (!reasonDict) {
      return {
        err: "Unknown status code",
      };
    }
    statusType = reasonDict.scan_type;

    pickrrDelhiveryDict.scan_type = statusType === "UD" ? "NDR" : statusType;
    pickrrDelhiveryDict.scan_datetime = statusDate;
    pickrrDelhiveryDict.track_info = trackData.Status.Instructions.toString();
    pickrrDelhiveryDict.awb = trackData.AWB.toString();
    pickrrDelhiveryDict.track_location = trackData.Status.StatusLocation.toString();
    pickrrDelhiveryDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[statusType];
    pickrrDelhiveryDict.pickrr_sub_status_code = reasonDict?.pickrr_sub_status_code || "";
    pickrrDelhiveryDict.courier_status_code = trackData.NSLCode;

    return pickrrDelhiveryDict;
  } catch (error) {
    pickrrDelhiveryDict.err = error.message;
    return pickrrDelhiveryDict;
  }
};

module.exports = { prepareDelhiveryData };

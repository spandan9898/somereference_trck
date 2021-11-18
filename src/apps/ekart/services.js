const moment = require("moment");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { EKART_STATUS_MAPPER } = require("./constant");

/*
  :param ekart_dict: {
      
          "reason": "",
          "sub_reasons": [],
          "request_id": null,
          "vendor_tracking_id": "ABCC0001201928",
          "merchant_reference_id": "ABCC0001201928",
          "status": "delivered",
          "shipment_type": "OutgoingShipment",
          "remarks": "",
          "merchant_code": "ABC",
          "merchant_name": "ABC Corp.",
          "event_date": "2019-01-27 20:47:52",
          "courier_name": "flipkartlogistics-cod",
          "seller_id": "ABC",
          "location": "fkl_Binola_ABC",
          "event": "shipment_delivered"
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
 *
 */
const prepareEkartData = (ekartDict) => {
  const pickrrEkartDict = {
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
    const trackData = ekartDict;
    const { sub_reasons: subReasons = [], event = "" } = trackData;
    const statusScanType = subReasons.length ? `${subReasons[0]}_${event}` : event;
    let statusType = statusScanType;
    const statusDateTime = trackData?.event_date;
    const statusDate = statusDateTime
      ? moment(statusDateTime).format("YYYY-MM-DD HH:MM:SS")
      : moment(new Date()).format("YYYY-MM-DD HH:MM:SS");

    if ("EDD" in trackData) {
      let eddDatetime = trackData.EDD;
      if (eddDatetime) {
        eddDatetime = moment(eddDatetime).format("YYYY-MM-DD HH:MM:SS");
      }
      pickrrEkartDict.EDD = eddDatetime;
    }
    if ("Receivedby" in trackData && trackData.Receivedby) {
      pickrrEkartDict.received_by = trackData.Receivedby;
    }
    const reasonDict = EKART_STATUS_MAPPER[statusType];

    if (!reasonDict) {
      return {
        err: "Unknown status code",
      };
    }
    statusType = reasonDict.scan_type;

    pickrrEkartDict.scan_type = statusType === "UD" ? "NDR" : statusType;
    pickrrEkartDict.scan_datetime = statusDate;
    pickrrEkartDict.track_info = trackData.event.toString();
    pickrrEkartDict.awb = trackData.vendor_tracking_id.toString();
    pickrrEkartDict.track_location = trackData.location.toString();
    pickrrEkartDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[statusType];
    pickrrEkartDict.pickrr_sub_status_code = reasonDict?.pickrr_sub_status_code || "";
    pickrrEkartDict.courier_status_code = statusType;

    return pickrrEkartDict;
  } catch (error) {
    pickrrEkartDict.err = error.message;
    return pickrrEkartDict;
  }
};

module.exports = prepareEkartData;

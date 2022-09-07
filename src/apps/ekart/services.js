const moment = require("moment");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const {
  EKART_STATUS_MAPPER,
  EKART_PULL_MAPPER,
  EKART_UD_REASON,
  UD_TO_OT_HUB_NOTES,
  UD_TO_DM_HUB_NOTES,
} = require("./constant");
const logger = require("../../../logger");

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
    const trackData = { ...ekartDict };
    const { meta_data: metaData } = trackData;
    const { sub_reasons: subReasons = [], event = "" } = trackData;
    let statusScanType = "";
    if (event === "shipment_rto_created") {
      statusScanType = event;
    } else {
      statusScanType = subReasons.length ? `${event}_${subReasons[0]}` : event;
    }
    if (event === "delivery_attempt_metadata") {
      pickrrEkartDict.awb = trackData?.vendor_tracking_id;
      pickrrEkartDict.track_info = event;
      pickrrEkartDict.longitude = metaData?.attempt_location?.longitude;
      pickrrEkartDict.latitude = metaData?.attempt_location?.latitude;
      return pickrrEkartDict;
    }
    let statusType = statusScanType;
    const statusDateTime = trackData?.event_date;
    const statusDate = statusDateTime
      ? moment(statusDateTime).format("YYYY-MM-DD HH:mm:ss")
      : moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    if ("EDD" in trackData) {
      let eddDatetime = trackData.EDD;
      if (eddDatetime) {
        eddDatetime = moment(eddDatetime).format("YYYY-MM-DD HH:mm:ss");
      }
      pickrrEkartDict.EDD = eddDatetime;
    }
    if ("Receivedby" in trackData && trackData.Receivedby) {
      pickrrEkartDict.received_by = trackData.Receivedby;
    }
    const reasonDict = EKART_STATUS_MAPPER[statusType.toLowerCase()];

    if (!reasonDict) {
      return {
        err: "Unknown status code",
      };
    }
    statusType = reasonDict.scan_type;
    let scanStatus = statusScanType;
    if (!scanStatus && ["UD", "NDR"].includes(statusType)) {
      const pickrrSubStatus = reasonDict?.pickrr_sub_status_code || "";
      if (pickrrSubStatus && pickrrSubStatus in EKART_UD_REASON) {
        scanStatus = EKART_UD_REASON[pickrrSubStatus];
      } else {
        scanStatus = "Undelivered";
      }
    }
    pickrrEkartDict.scan_type = statusType === "UD" ? "NDR" : statusType;
    pickrrEkartDict.scan_datetime = statusDate;
    pickrrEkartDict.track_info = scanStatus;
    pickrrEkartDict.awb = trackData.vendor_tracking_id.toString();
    pickrrEkartDict.track_location = trackData.location.toString();
    pickrrEkartDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[statusType];
    pickrrEkartDict.pickrr_sub_status_code = reasonDict?.pickrr_sub_status_code || "";
    pickrrEkartDict.courier_status_code = statusScanType;
    pickrrEkartDict.otp = metaData?.attempt_details?.otp || "";

    return pickrrEkartDict;
  } catch (error) {
    pickrrEkartDict.err = error.message;
    return pickrrEkartDict;
  }
};

// {"status":"out_for_pickup","event_date":"2022-04-11T12:38:05+0530","event_date_iso8601":"2022-04-11T12:38:05+05:30","city":"Dwarka","description":"shipment_out_for_pickup","public_description":"shipment_out_for_pickup","cs_notes":null,"awbNumber":"WSPP2789544767","pickupTime":"","edd":""}

/**
 *
 * @param {*} ekartDict prepares data for pulled events
 */
const preparePulledEkartData = (ekartDict) => {
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
    pickrrEkartDict.awb = ekartDict?.awbNumber;
    if (!pickrrEkartDict.awb) {
      return {};
    }
    const ekartStatus = ekartDict?.status ? ekartDict.status.toString().toLowerCase() : "";
    const ekartEDD = ekartDict?.edd;

    // edd comes as a string before PP event --> "Shipment yet to be dispatched"

    const ekartEventDate = ekartDict?.event_date;
    const scanType = EKART_PULL_MAPPER[ekartStatus];
    if (!scanType) {
      return {
        err: "Unknown status code",
      };
    }
    const hubNotes = ekartDict?.hub_notes ? ekartDict.hub_notes.toString().toLowerCase() : "";
    if (["UD", "NDR"].includes(scanType.pickrr_code)) {
      if (UD_TO_OT_HUB_NOTES.includes(hubNotes)) {
        scanType.pickrr_code = "OT";
      }
      if (UD_TO_DM_HUB_NOTES.includes(hubNotes)) {
        scanType.pickrr_code = "DM";
      }
    }

    pickrrEkartDict.scan_type = scanType.pickrr_code === "UD" ? "NDR" : scanType.pickrr_code;
    pickrrEkartDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;

    if (
      ekartStatus === "delivered" &&
      (ekartDict.cs_notes || "").toLowerCase() === "marked_as_rto"
    ) {
      pickrrEkartDict.scan_type = "RTO";
    }
    pickrrEkartDict.EDD = moment(ekartEDD).isValid()
      ? moment(ekartEDD).add(330, "minutes").format("YYYY-MM-DD HH:mm:ss")
      : "";
    pickrrEkartDict.scan_datetime = moment(ekartEventDate).isValid()
      ? moment(ekartEventDate).add(330, "minutes").format("YYYY-MM-DD HH:mm:ss")
      : "";
    pickrrEkartDict.track_location = ekartDict?.city || "";
    if (pickrrEkartDict.scan_type === "PP") {
      pickrrEkartDict.pickup_datetime = pickrrEkartDict?.scan_datetime;
    }
    pickrrEkartDict.courier_status_code = ekartStatus;
    pickrrEkartDict.track_info =
      ekartDict?.public_description || PICKRR_STATUS_CODE_MAPPING[scanType?.pickrr_code];
    pickrrEkartDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.pickrr_code];
    if (pickrrEkartDict?.scan_type === "DL") {
      pickrrEkartDict.received_by = ekartDict?.received_by || "SELF";
    }
    return pickrrEkartDict;
  } catch (error) {
    logger.error("Error While Preparng Ekart Data ---->", error);
    pickrrEkartDict.err = error.message;
    return pickrrEkartDict;
  }
};

module.exports = { prepareEkartData, preparePulledEkartData };

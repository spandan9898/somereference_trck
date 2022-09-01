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
    if (statusType === "DL") {
      pickrrXbsDict.longitude = xbsDict?.Longitude;
      pickrrXbsDict.latitude = xbsDict?.Latitude;
    }
    pickrrXbsDict.track_location = trackData.CurrentLocation;
    pickrrXbsDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[statusType];
    pickrrXbsDict.pickrr_sub_status_code = reasonDict?.pickrr_sub_status_code || "";
    pickrrXbsDict.courier_status_code = statusScanType;
    if (xbsDict?.ofdotp) {
      pickrrXbsDict.otp = xbsDict.ofdotp;
    }

    return pickrrXbsDict;
  } catch (error) {
    pickrrXbsDict.err = error.message;
    return pickrrXbsDict;
  }
};

/**
 * 
 * @payload xbsDict
 *  {
        Status: 'RAD',
        StatusCode: 'ReachedAtDestination',
        StatusDateTime: '24-04-2022 15:37:28',
        Remarks: 'Shipment reached at destination',
        ReasonCode: null,
        OriginLocation: 'Tenali',
        DestinationLocation: 'HYD/NSG',
        Location: 'HYD/NSG',
        trackingId: '2329220602783370',
        isReverse: true,
        event: 'pull'
      }
 */
const prepareReversePulledXBSData = (xbsDict) => {
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
    const { Status, StatusDateTime, Remarks, ReasonCode, Location, trackingId } = xbsDict;

    let mapperString;
    if (ReasonCode) {
      mapperString = `${Status}-${ReasonCode}`.toLowerCase();
    } else {
      mapperString = `${Status}-`.toLowerCase();
    }
    const mapping = XBS_REVERSE_MAPPER[mapperString];

    if (!mapping) {
      return {
        error: "Mapping not found",
      };
    }
    const statusType = mapping?.scan_type;

    pickrrXbsDict.awb = trackingId;
    pickrrXbsDict.scan_type = statusType === "UD" ? "NDR" : statusType;
    pickrrXbsDict.pickrr_sub_status_code = mapping?.pickrr_sub_status_code;
    pickrrXbsDict.courier_status_code = mapperString;

    pickrrXbsDict.scan_datetime = moment(StatusDateTime, "DD-MM-YYYY HH:mm:ss").toDate();
    pickrrXbsDict.track_location = Location;
    pickrrXbsDict.track_info = Remarks || PICKRR_STATUS_CODE_MAPPING[statusType];
    pickrrXbsDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[statusType];

    if (statusType === "PP") {
      pickrrXbsDict.pickup_datetime = pickrrXbsDict.scan_datetime;
    }

    return pickrrXbsDict;
  } catch (error) {
    pickrrXbsDict.err = error.message;
    return pickrrXbsDict;
  }
};

/**
 *
 * prepares Pulled Xbs Data
 * @payload {
        PickUpDate: '12-04-2022',
        PickUpTime: '1333',
        OriginLocation: 'BLR/FC1',
        DestinationLocation: 'MAA/MVL-TML',
        Weight: '0',
        ExpectedDeliveryDate: '4/14/2022 12:33:16 AM',
        Status: 'Delivered',
        StatusCode: 'DLVD',
        StatusDate: '19-04-2022',
        StatusTime: '1943',
        Location: 'MAA/MVL-TML, Chennai, TAMIL NADU',
        Comment: 'Shipment Delivered by SR: Prabhakaran A, MobileNo: 9841784763, DeliveryDate: 2022-04-19 19:43:01, Receiver Name: edelweiss rajesh ',
        LocationPinCode: '600095',
        trackingId: '13329222456247',
        isReverse: false,
        event: 'pull'
      }
 */
const preparePulledXBSData = (xbsDict) => {
  if (xbsDict.isReverse) {
    return prepareReversePulledXBSData(xbsDict);
  }
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
    const {
      PickUpDate,
      PickUpTime,
      ExpectedDeliveryDate,
      Status,
      StatusCode,
      StatusDate,
      StatusTime,
      Location,
      Comment,
      trackingId,
    } = xbsDict;
    const mapperString = `${Status}-${StatusCode}`;
    const pickrrStatusInfo = XBS_PULL_MAPPER[mapperString.toLowerCase()];
    if (!pickrrStatusInfo?.scan_type) {
      return {
        err: "No Pickrr Status Mapped to the current xbs Status",
      };
    }

    let xbsPickupScanTime = `${PickUpDate} ${PickUpTime}` || "";
    xbsPickupScanTime = moment(xbsPickupScanTime, "DD-MM-YYYY hhm");

    let xbsStatusTime = `${StatusDate} ${StatusTime}`;
    xbsStatusTime = moment(xbsStatusTime, "DD-MM-YYYY hhm");

    let xbsEdd;
    if (ExpectedDeliveryDate) {
      xbsEdd = moment(ExpectedDeliveryDate, "MM/DD/YYYY HH:mm:ss a p");
      xbsEdd = xbsEdd.isValid() ? xbsEdd.toDate() : null;
    }
    const statusType = pickrrStatusInfo.scan_type;

    pickrrXbsDict.awb = trackingId;
    pickrrXbsDict.scan_type = statusType === "UD" ? "NDR" : statusType;
    pickrrXbsDict.track_location = Location;
    pickrrXbsDict.pickup_datetime = xbsPickupScanTime.isValid() ? xbsPickupScanTime.toDate() : null;
    pickrrXbsDict.scan_datetime = xbsStatusTime.isValid() ? xbsStatusTime.toDate() : null;
    pickrrXbsDict.pickrr_sub_status_code = pickrrStatusInfo.pickrr_sub_status_code || "";
    pickrrXbsDict.EDD = xbsEdd;
    pickrrXbsDict.track_info = Comment;
    pickrrXbsDict.courier_status_code = mapperString;
    pickrrXbsDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[statusType];

    if (statusType === "PP") {
      pickrrXbsDict.pickup_datetime = pickrrXbsDict.scan_datetime;
    }

    return pickrrXbsDict;
  } catch (error) {
    pickrrXbsDict.err = error.message;
    return pickrrXbsDict;
  }
};

module.exports = { prepareXbsData, preparePulledXBSData };

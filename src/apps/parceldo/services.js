const moment = require("moment");
const _ = require("lodash");

const { PARCELDO_CODE_MAPPER } = require("./constant");

/*
    parceldo sample payload : {
            "status": "SUCCESS",
            "message": "Success",
            "response": [
                {
                    "date": "2021/05/04 20:50:00",
                    "reason": "",
                    "orderno": "ST28342",
                    "waybill": "10000667686",
                    "statusId": 123,
                    "activity": "Shipment Forwarded To Destination",
                    "reasonId": null,
                    "location": "DEL/PC1, Delhi NCR, DELHI",
                    "reasonCode": "",
                    "isRTO": "N"
                }
            ]
        }
*/
/**
 *
 * @param {\} parceldoDict
 * @returns pickrr dict
 */
const prepareParceldoData = (parceldoDict) => {
  const pickrrParceldoDict = {
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
    let statusID = _.get(parceldoDict, "response[0].statusId", 1);
    statusID = Number(statusID);
    const reasonCode = _.get(parceldoDict, "response[0].reasonCode", "");
    const mapperKey = reasonCode.length ? `${statusID}_${reasonCode}` : statusID;
    if (mapperKey in PARCELDO_CODE_MAPPER) {
      const statusMap = PARCELDO_CODE_MAPPER[mapperKey];
      let { scanType } = statusMap;
      const isRTO = _.get(parceldoDict, "response[0].isRTO", "");
      if (statusID === 111 && isRTO === "Y") {
        scanType = "RTD";
      }
      const date = _.get(parceldoDict, "response[0].date", "");
      const scanDatetime = date
        ? moment(date, "YYYY/MM/DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
        : "";
      const EDDDatetime = _.get(parceldoDict, "response[0].EDD", "");
      pickrrParceldoDict.EDD = EDDDatetime
        ? moment(EDDDatetime, "YYYY/MM/DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
        : "";
      pickrrParceldoDict.received_by = _.get(parceldoDict, "response[0].receivedBy", "");
      pickrrParceldoDict.scan_type = scanType === "UD" ? "NDR" : scanType;
      pickrrParceldoDict.scan_datetime = scanDatetime;
      pickrrParceldoDict.track_info = _.get(parceldoDict, "response[0].activity", "");
      pickrrParceldoDict.awb = _.get(parceldoDict, "response[0].waybill", "");
      pickrrParceldoDict.track_location = _.get(parceldoDict, "response[0].location", "");
      pickrrParceldoDict.pickrr_status = statusMap.pickrrStatus;
      pickrrParceldoDict.pickrr_sub_status_code = statusMap.pickrrSubStatusCode;
      pickrrParceldoDict.courier_status_code = statusID;

      if (pickrrParceldoDict.scan_type.toString() === "PP") {
        const pickupDatetime = scanDatetime;
        pickrrParceldoDict.pickupDatetime = pickupDatetime;
      }
    }
    return pickrrParceldoDict;
  } catch (error) {
    pickrrParceldoDict.err = error.message;
    return pickrrParceldoDict;
  }
};

module.exports = {
  prepareParceldoData,
};

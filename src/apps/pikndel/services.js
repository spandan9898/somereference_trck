const moment = require("moment");

const { PIKNDEL_STATUS_MAPPER } = require("./constant");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**

 * 

 * @param {*} payload 

{

   "ClientUniqueNo":"62503216",
   "AWB":"PD0055378",
   "OrderStatus":"DLD",
   "Message":"DELIVERED",
   "Time":"2022-05-28 19:04:31",
   "ReasonCode":"",
   "Reason":"",
   "OrderDate":"2022-05-27 12:05:01",
   "ExpectedDeliveryDate":"2022-05-28 21:00:00",
   "FE":{
      "Name":"HARISH CHANDRA",
      "Mobile":"8383071467"
   }
}
 */
const preparePikNDelData = (payload) => {
  const pickrrDict = {
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
    const { AWB, OrderStatus, Message, Time, ExpectedDeliveryDate } = payload;
    pickrrDict.awb = AWB;
    const scanType = PIKNDEL_STATUS_MAPPER[OrderStatus.toLowerCase()];
    if (!scanType) {
      return { err: "Unknown status code" };
    }
    let scanDatetime = moment(Time);
    scanDatetime = scanDatetime.isValid() ? scanDatetime.format("YYYY-MM-DD HH:mm:ss") : "";
    if (!scanDatetime) {
      return { err: "Invalid scan datetime" };
    }
    if (ExpectedDeliveryDate) {
      let eddDate = moment(ExpectedDeliveryDate, "YYYY-MM-DD HH:mm:ss");
      eddDate = eddDate.isValid() ? eddDate.format("YYYY-MM-DD HH:mm:ss") : "";
      if (eddDate) {
        pickrrDict.EDD = eddDate;
      }
    }

    pickrrDict.scan_datetime = scanDatetime;
    pickrrDict.courier_status_code = OrderStatus;
    pickrrDict.scan_type = scanType.scan_type === "UD" ? "NDR" : scanType.scan_type;
    pickrrDict.track_info = Message;
    pickrrDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType?.scan_type];
    pickrrDict.pickrr_sub_status_code = scanType?.pickrr_sub_status_code;
    if (scanType.scan_type === "PP") {
      pickrrDict.pickup_datetime = pickrrDict.scan_datetime;
    }

    return pickrrDict;
  } catch (error) {
    pickrrDict.err = error.message;

    return pickrrDict;
  }
};

module.exports = {
  preparePikNDelData,
};

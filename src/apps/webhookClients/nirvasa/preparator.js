const moment = require("moment");
const logger = require("../../../../logger");
const { NIRVASA_STATUS_MAPPER } = require("./constants");

/**
 *
 * prepares Info to be sent to Nirvasa
 * trackObj - updated tracking Document from commontrackinginfo
 */
const prepareNirvasaWebhookData = (trackObj) => {
  try {
    const preparedWebhookData = {
      awb: "",
      statusTime: "",
      datetime: "",
      edd: "",
      status: "",
      reason_code: "",
      reason_code_number: "",
      location: "",
      Employee: "",
      status_update_number: "",
      order_number: "",
      city: "",
      remarks: "",
      ref_awb: "",
      product_type: "",
    };
    const { status } = trackObj;
    preparedWebhookData.awb = trackObj.tracking_id || trackObj.courier_tracking_id;
    const statusTime = trackObj.status.current_status_time;
    const statusType = status?.current_status_type;
    preparedWebhookData.datetime = moment(statusTime).isValid()
      ? moment(statusTime).add(330, "minute").format("YYYY-MM-DD HH:MM:SS")
      : "";
    preparedWebhookData.edd = moment(trackObj.edd_stamp).isValid()
      ? moment(statusTime).add(330, "minute").format("YYYY-MM-DD")
      : "";
    preparedWebhookData.status = NIRVASA_STATUS_MAPPER[statusType] || "";
    preparedWebhookData.reason_code = status.current_status_type || "";
    preparedWebhookData.reason_code_number = "";
    preparedWebhookData.location = status?.current_status_location || "";
    preparedWebhookData.status_update_number = "";
    preparedWebhookData.order_number = trackObj.pickrr_order_id || trackObj.client_order_id;
    preparedWebhookData.city = trackObj?.info?.to_city || "";
    preparedWebhookData.remarks = status.current_status_body || "";
    preparedWebhookData.product_type = trackObj.info?.cod_amount ? "cod" : "prepaid";
    return preparedWebhookData;
  } catch (error) {
    logger.error("failed while psreparing nirvasa webhook data", error);
    return {};
  }
};

module.exports = { prepareNirvasaWebhookData };

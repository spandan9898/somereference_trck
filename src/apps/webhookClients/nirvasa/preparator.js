const moment = require("moment");
const logger = require("../../../../logger");
const { NIRVANA_STATUS_MAPPER } = require("./constants");

/**
 *
 * prepares Info to be sent to Nirvasa
 * trackObj - updated tracking Document from commontrackinginfo
 */
const prepareNirvasaWebhookData = (trackObj) => {
  try {
    const preparedWebhookData = {};
    const { status } = trackObj;
    preparedWebhookData.awb = trackObj.courier_tracking_id;
    const statusTime = trackObj.status.current_status_time;
    preparedWebhookData.datetime = moment(statusTime).isValid()
      ? moment(statusTime).strftime("YYYY-MM-DD HH:MM:SS")
      : null;
    preparedWebhookData.edd = moment(trackObj.edd_stamp).isValid()
      ? moment(statusTime).strftime("YYYY-MM-DD")
      : null;
    preparedWebhookData.status = NIRVANA_STATUS_MAPPER?.status.current_status_type;
    preparedWebhookData.reason_code = status.current_status_type;
    preparedWebhookData.reason_code_number = "";
    preparedWebhookData.location = status?.current_status_location;
    preparedWebhookData.Employee = "";
    preparedWebhookData.status_update_number = "";
    preparedWebhookData.order_number = trackObj.client_order_id;
    preparedWebhookData.city = trackObj?.info?.to_city || "";
    preparedWebhookData.remarks = status.current_status_body;
    preparedWebhookData.preparedWebhookData.ref_awb = "";
    preparedWebhookData.product_type = trackObj.info?.cod_amount ? "cod" : "prepaid";

    return preparedWebhookData;
  } catch (error) {
    logger.error("failed while preparing nirvasa webhook data", error);
  }
};

module.exports = { prepareNirvasaWebhookData };

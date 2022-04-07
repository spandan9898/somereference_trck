const moment = require("moment");
const logger = require("../../../../logger");

/**
 *
 * @param {tracking Details for Waybill} trackobj
 * prepares Webhook Data to be sent to Bellavita
 */
const prepareBellavitaWebhookData = (trackObj) => {
  const preparedWebhookData = {
    type: "event",
    customer_id: "",
    actions: [
      {
        action: "",
        current_time: "",
        user_timezone_offset: "",
      },
    ],
  };
  try {
    preparedWebhookData.customer_id = trackObj?.info?.to_email || "";
    const { status } = trackObj;
    const eventInfo = {
      action: status?.current_status_type || "",
      current_time: moment(status?.current_status_time).isValid()
        ? `${moment(status?.current_status_time).format("YYYY-MM-DDTHH:MM:SS")}Z`
        : "",
      user_timezone_offset: 19800,
    };
    preparedWebhookData.actions[0] = eventInfo;
    return preparedWebhookData;
  } catch (error) {
    logger.error("Error While Preparing Webhook Data for Bellavita");
    return {};
  }
};

module.exports = {
  prepareBellavitaWebhookData,
};

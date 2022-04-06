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

    const eventInfo = {
      action: trackObj?.status?.current_status_type || "",
      current_time: `${moment().format("YYYY-MM-DDTHH:MM:SS")}Z` || "",
      user_timezone_offset: moment(trackObj?.status?.current_status_time).utcOffset() * 60 || "",
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

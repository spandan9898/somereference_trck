const moment = require("moment");
const logger = require("../../../../logger");

/**
 *
 * @param {tracking Details for Waybill} trackobj
 * prepares Webhook Data to be sent to Bellavita
 *  webhookData --- >{ 
      "type": "transition",
      "elements": [
              {
                "type": "customer",
                "customer_id": "john@example.com",
                "attributes": {
				                "name": "John",
                        "mobile": "8112205869",
                        "email": "john@example.com"
			                  }
                    },
              {
                "type": "event", 
                "customer_id": "john@example.com", 
                "actions": [
                        { 
                          "action": "PP", 
                          "current_time": "2022-04-07T00:04:00Z", 
                          "user_timezone_offset": 19800 
                        }, 
                        ]  
                      }
                    ] 
                    }
 *
 *
 */
const prepareBellavitaWebhookData = (trackObj) => {
  const preparedWebhookData = {
    type: "transition",
    elements: [],
  };
  try {
    preparedWebhookData.customer_id = trackObj?.info?.to_email || "";
    const { status } = trackObj;
    const { info } = trackObj;
    const customerInfo = {
      type: "customer",
      customer_id: info?.to_email || "",
      attributes: {
        name: info?.to_name,
        mobile: info?.to_phone_number,
        email: info?.to_email,
      },
    };
    const eventInfo = {
      type: "event",
      customer_id: info?.to_email || "",
      actions: [
        {
          action: status.current_status_type,
          current_time: moment(status?.current_status_time).isValid()
            ? `${moment(status?.current_status_time).format("YYYY-MM-DDTHH:MM:SS")}Z`
            : "",
          user_timezone_offset: 19800,
        },
      ],
    };
    preparedWebhookData.elements.push(customerInfo);
    preparedWebhookData.elements.push(eventInfo);
    return preparedWebhookData;
  } catch (error) {
    logger.error("Error While Preparing Webhook Data for Bellavita");
    return {};
  }
};

module.exports = {
  prepareBellavitaWebhookData,
};

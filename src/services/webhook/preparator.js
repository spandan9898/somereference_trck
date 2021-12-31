const moment = require("moment");

const logger = require("../../../logger");

/**
 * @desc format historyMap key,
 *      by current string and current status time
 */
const prepareCurrentStatusWebhookKeyMap = (currentStatusType, currentStatusTime) => {
  try {
    let formattedCurrentStatusTime = moment(currentStatusTime);
    if (!formattedCurrentStatusTime.isValid()) {
      return `${currentStatusType}_${currentStatusTime}`;
    }
    formattedCurrentStatusTime = formattedCurrentStatusTime
      .subtract(330, "m")
      .format("YYYY-MM-DD HH:mm:ss");
    return `${currentStatusType}_${formattedCurrentStatusTime}`;
  } catch (error) {
    logger.error("prepareCurrentStatusWebhookKeyMap", error);
    return "";
  }
};

module.exports = {
  prepareCurrentStatusWebhookKeyMap,
};

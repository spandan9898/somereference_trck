const _ = require("lodash");

const logger = require("../../../logger");

/**
 *
 * @param {*} trackingObj
 * @desc check if current status(event) is in mandatory_status_map and already
 * sent trigger
 * @returns true/false
 */
const checkIfCompulsoryEventAlreadySent = (trackingObj) => {
  try {
    const currentEvent = _.get(trackingObj, "status.current_status_type", "");
    const mandatoryStatusMap = _.get(trackingObj, `mandatory_status_map[${currentEvent}]`);
    return mandatoryStatusMap?.is_sent && mandatoryStatusMap?.is_received_success;
  } catch (error) {
    logger.error("checkIfCompulsoryEventAlreadySent", error);
    return false;
  }
};

module.exports = {
  checkIfCompulsoryEventAlreadySent,
};

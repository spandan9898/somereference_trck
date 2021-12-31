const moment = require("moment");

const logger = require("../../../../logger");
const createShopcluesTrackingJson = require("../shopclues/preparator");

/**
 *
 * @param {*} trackResponse
 */
const createSmartShipTrackingJson = (trackResponse) => {
  try {
    let edd = trackResponse.edd_stamp;
    if (moment(edd).isValid()) {
      edd = moment(edd).format("DD-MM-YYYY hh:mm");
    }
    const preparedDict = createShopcluesTrackingJson(trackResponse);
    if (!preparedDict) {
      return {};
    }
    preparedDict.expected_delivery_date = edd;
    preparedDict.dynamic_expected_delivery_date = edd;
    return preparedDict;
  } catch (error) {
    logger.error("createSmartShipTrackingJson", error);
    return {};
  }
};

module.exports = createSmartShipTrackingJson;

const createSmartShipTrackingJson = require("./preparator");

/**
 *
 */
class SmartShipServices {
  static init(trackingInfoDoc) {
    return createSmartShipTrackingJson(trackingInfoDoc);
  }
}

module.exports = SmartShipServices;

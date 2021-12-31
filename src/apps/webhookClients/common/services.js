const prepareCommonTrackingInfo = require("./preparator");

/**
 *
 */
class CommonServices {
  static async init(trackingInfoDoc) {
    return prepareCommonTrackingInfo(trackingInfoDoc);
  }
}

module.exports = CommonServices;

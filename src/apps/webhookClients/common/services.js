const prepareCommonTrackingInfo = require("./preparator");

/**
 *
 */
class CommonServices {
  static init(trackingInfoDoc) {
    return prepareCommonTrackingInfo(trackingInfoDoc);
  }
}

module.exports = CommonServices;

const createNaaptolTrackingJson = require("./preparator");

/**
 *
 */
class NaaptolServices {
  static init(trackingInfoDoc) {
    return createNaaptolTrackingJson(trackingInfoDoc);
  }
}

module.exports = NaaptolServices;

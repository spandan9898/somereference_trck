const prepareNirvasaWebhookData = require("./preparator");

/**
 * init prepare webhook data for Nirvasa
 */
class NirvasaServices {
  static init(trackObj) {
    return prepareNirvasaWebhookData(trackObj);
  }
}

module.exports = NirvasaServices;

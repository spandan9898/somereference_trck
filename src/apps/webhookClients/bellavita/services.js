const prepareBellavitaWebhookData = require("./preparator");

/**
 *
 */
class BellavitaService {
  static init(trackObj) {
    prepareBellavitaWebhookData(trackObj);
  }
}

module.exports = BellavitaService;

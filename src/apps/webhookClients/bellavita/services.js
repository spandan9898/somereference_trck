const { prepareBellavitaWebhookData } = require("./preparator");

/**
 *
 */
class BellavitaService {
  static init(trackObj) {
    return prepareBellavitaWebhookData(trackObj);
  }
}

module.exports = BellavitaService;

const CommonServices = require("./common/services");
const NaaptolServices = require("./naaptol/services");
const ShopcluesServices = require("./shopclues/services");
const SmartShipServices = require("./smartShip/services");
const NirvasaServices = require("./nirvasa/services");

const {
  SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS,
  SMART_SHIP_AUTH_TOKENS,
  NAAPTOL_AUTH_TOKEN,
} = require("./constants");
const logger = require("../../../logger");
const { NIRVASA_AUTH_TOKEN } = require("../../services/webhook/constants");

/**
 * Return prepared data based on auth token
 */
class WebhookClient {
  constructor(trackingObj) {
    this.authToken = trackingObj.auth_token;
    this.trackingObj = trackingObj;
  }

  async getPreparedData() {
    if (!this.authToken) {
      logger.error("getPreparedData - auth token not found");
    }
    if (SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS.includes(this.authToken)) {
      return ShopcluesServices.init(this.trackingObj);
    }
    if (SMART_SHIP_AUTH_TOKENS.includes(this.authToken)) {
      return SmartShipServices.init(this.trackingObj);
    }
    if (NAAPTOL_AUTH_TOKEN.includes(this.authToken)) {
      return NaaptolServices.init(this.trackingObj);
    }
    if (NIRVASA_AUTH_TOKEN.includes(this.authToken)) {
      return NirvasaServices.init(this.trackingObj);
    }

    return CommonServices.init(this.trackingObj);
  }
}

module.exports = WebhookClient;

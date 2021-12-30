const CommonServices = require("./common/services");
const NaaptolServices = require("./naaptol/services");
const ShopcluesServices = require("./shopclues/services");
const SmartShipServices = require("./smartShip/services");

const {
  SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS,
  SMART_SHIP_AUTH_TOKENS,
  NAAPTOL_AUTH_TOKEN,
} = require("./constants");

/**
 * Return prepared data based on auth token
 */
class WebhookClient {
  constructor(authToken, trackingObj) {
    this.authToken = authToken;
    this.trackingObj = trackingObj;
  }

  getPreparedData() {
    if (SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS.includes(this.authToken)) {
      return ShopcluesServices.init(this.trackingObj);
    }
    if (SMART_SHIP_AUTH_TOKENS.includes(this.authToken)) {
      return SmartShipServices.init(this.trackingObj);
    }
    if (NAAPTOL_AUTH_TOKEN.includes(this.authToken)) {
      return NaaptolServices.init(this.trackingObj);
    }
    return CommonServices.init(this.trackingObj);
  }
}

module.exports = WebhookClient;

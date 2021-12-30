const createShopcluesTrackingJson = require("./preparator");

/**
 *
 */
class ShopcluesServices {
  static init(trackingInfoDoc) {
    return createShopcluesTrackingJson(trackingInfoDoc);
  }
}

module.exports = ShopcluesServices;

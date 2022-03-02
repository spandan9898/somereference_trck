/* eslint-disable max-classes-per-file */
/* eslint-disable prefer-destructuring */
const moment = require("moment");

const { MakeAPICall } = require("../../../utils");
const {
  PARENT_CHILD_COURIER_MAPS,
  REQUEST_TIMEOUT,
  WOOCOM_TIMEOUT_STORE_LIST,
} = require("./constants");
const { getCurrentTrackStatus, getWoocomClientStatus } = require("./helpers");

/**
 *
 */
class UpdatePlatformClients {
  static async updateInstamojoOrderTracking(trackingObj) {
    try {
      const payload = {
        auth_token: trackingObj.auth_token,
        order_id: trackingObj.client_order_id, // TODO: confirm
        tracking_number: trackingObj.tracking_id, // Todo: Confirm
        carrier: PARENT_CHILD_COURIER_MAPS[trackingObj.courier_used] || trackingObj.courier_used,
        tracking_url: `https://pickrr.com/tracking/#/?tracking_id=${trackingObj.trackingId}`,
      };

      const URL = "https://cfapi.pickrr.com/plugins/instamojo/api/v1/update-order-tracking/";
      const makeApiCall = new MakeAPICall(URL, payload);
      const response = await makeApiCall.post();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateInstamojoOrderStatus(trackingObj, currentStatus) {
    try {
      const URL = "https://cfapi.pickrr.com/plugins/instamojo/api/v1/update-order-status/";
      const payload = {
        order_status: currentStatus,
        order_id: trackingObj.client_order_id,
        auth_token: trackingObj.auth_token,
      };
      const makeApiCall = new MakeAPICall(URL, payload);
      const response = await makeApiCall.post();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateZohoInventoryOrderStatus(trackingObj, currentStatus) {
    try {
      const URL = "https://cfapi.pickrr.com/plugins/zoho-inventory/api/v1/update-order-status/";
      const clientExtraVar = JSON.parse(trackingObj.clientExtraVar); // TODO: from where we'll get this
      const shopName = clientExtraVar.get("shop_name");
      const platformOrderId = clientExtraVar.get("platform_order_id");
      const payload = {
        order_status: currentStatus,
        platform_order_id: platformOrderId,
        auth_token: trackingObj.auth_token,
        shop_name: shopName,
      };
      if (["DL", "OC"].includes(currentStatus)) {
        const makeApiCall = new MakeAPICall(URL, payload);
        const response = await makeApiCall.post();
        return response;
      }
      return {};
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateZohoOrderStatus(trackingObj, currentStatus) {
    try {
      const URL = "https://cfapi.pickrr.com//plugins/zoho/update-order-status/";
      const clientExtraVar = JSON.parse(trackingObj.clientExtraVar);
      const platformOrderId = clientExtraVar.get("platform_order_id"); // TODO

      let deliveryDate;
      if (trackingObj.deliveryDate) {
        deliveryDate = trackingObj.deliveryDate
          .moment(trackingObj.deliveryDate)
          .format("DD-MM-YYYY HH:mm");
      } else {
        deliveryDate = null;
      }
      const payload = {
        order_status: currentStatus,
        order_id: platformOrderId,
        auth_token: trackingObj.auth_token,
        shop_name: clientExtraVar.get("shop_name"), // TODO
        delivery_date: deliveryDate || null, // TODO: DL's current_status_time ??
        tracking_number: trackingObj.tracking_id,
        tracking_url: `https://pickrr.com/tracking/#/?tracking_id=${trackingObj.tracking_id}`,
        shipment_date: moment(trackingObj.pickup_time).format("DD-MM-YYYY HH:mm"), // TODO findPickupDate, Confirm Date format
        carrier: trackingObj.courier_used,
      };
      if (["DL", "OT"].includes(currentStatus)) {
        const makeApiCall = new MakeAPICall(URL, payload);
        const response = await makeApiCall.post();
        return response;
      }
      return {};
    } catch (error) {
      throw new Error(error);
    }
  }

  static getWoocomBaseUrl(storeName) {
    if (storeName.startsWith("http")) {
      return `${storeName}/wp/json/wc/3`;
    }
    return `https://${storeName}/wp-json/wc/v3`;
  }

  static async updateOrderStatusOnWoocom(woocomUser, status, clientOrderId) {
    try {
      const { username, password, storeName } = woocomUser; // TODO ??
      const defaultRequestTimeout = storeName in WOOCOM_TIMEOUT_STORE_LIST ? 10 : REQUEST_TIMEOUT;
      const payload = {
        status,
      };

      const URL = `${this.getWoocomBase(storeName)}/orders/${clientOrderId}`;
      const headers = {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
      };
      const params = {
        consumer_key: username,
        consumer_secret: password,
      };
      const makeApiCall = new MakeAPICall(URL, payload, headers, params, defaultRequestTimeout);
      let response;
      try {
        response = await makeApiCall.put();
      } catch {
        response = await makeApiCall.post();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateClientBikayiStoreOrderStatus(trackingObj, currentStatus) {
    try {
      const payload = {
        auth_token: trackingObj.auth_token,
        order_id: trackingObj.client_order_id,
        tracking_id: trackingObj.tracking_id,
        status: currentStatus,
      };
      const URL = "https://cfapi.pickrr.com/plugins/bikayi/update-order-status/";
      const makeApiCall = new MakeAPICall(URL, payload);
      const response = await makeApiCall.post();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateClientOpencartStore(trackingObj, currentStatus) {
    try {
      const payload = {
        auth_token: trackingObj.auth_token,
        order_id: trackingObj.client_order_id,
        tracking_id: trackingObj.tracking_id,
        status: currentStatus,
      };
      const URL = "https://cfapi.pickrr.com/plugins/opencart/update-order-status/";
      const makeApiCall = new MakeAPICall(URL, payload);
      const response = await makeApiCall.post();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateClientEasyecomStore(trackingObj, currentStatus) {
    try {
      const payload = {
        auth_token: trackingObj.auth_token,
        order_id: trackingObj.client_order_id, // TODO
        tracking_id: trackingObj.tracking_id,
        status: currentStatus,
      };
      const URL = "https://cfapi.pickrr.com/plugins/easyecom/amazon/update-order-status/";
      const makeApiCall = new MakeAPICall(URL, payload);
      const response = await makeApiCall.post();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateClientMagento2Store(trackingObj, platformObj, currentStatus) {
    try {
      const payload = {
        auth_token: trackingObj.auth_token,
        website_url: platformObj.shopName,
        order_id: trackingObj.client_order_id,
        tracking_id: trackingObj.tracking_id,
        status: currentStatus,
      };
      const URL = "https://cfapi.pickrr.com/plugins/magento2/update-order-status/";
      const makeApiCall = new MakeAPICall(URL, payload);
      const response = await makeApiCall.post();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateClientShopifyStoreOrderStatus(trackingObj, platformObj, currentStatus) {
    try {
      // TODO: client ?

      let storeName;
      let shopifyOrderId;
      let locationId;
      if (!trackingObj.shopPlatform) {
        // TODO

        if ("-loc:" in trackingObj.clientExtraVar) {
          // TODO

          shopifyOrderId = trackingObj.clientExtraVar.split("-loc:")[0];
          if ("-s-:" in trackingObj.clientExtraVar) {
            storeName = trackingObj.clientExtraVar.split("-s-:")[1];
            [locationId] = trackingObj.clientExtraVar.split("-loc:")[1].split("-s-:");
          } else locationId = trackingObj.clientExtraVar.split("-loc:")[1];
        } else {
          shopifyOrderId = trackingObj.clientExtraVar;
          locationId = null;
        }
        const payload = {
          shop_name: storeName,
          shopify_order_id: shopifyOrderId,
          tracking_number: trackingObj.trackingId,
          status: currentStatus,
          courier_used: PARENT_CHILD_COURIER_MAPS[trackingObj.courierUsed],
          location_id: locationId,
          currency: "INR",
          amount: `${trackingObj.info?.cod_amount} || 0`,
          auth_token: trackingObj.auth_token,
          v2: true,
        };
        const URL = "https://cfapi.pickrr.com/plugins/shopify/v2/update-order-status/";

        const makeApiCall = new MakeAPICall(URL, payload, undefined, payload, 2);
        const response = await makeApiCall.post();
        return response;
      }
      if ("-loc:" in trackingObj.clientExtraVar) {
        [shopifyOrderId, locationId] = trackingObj.clientExtraVar.split("-loc:");
      } else {
        shopifyOrderId = trackingObj.clientExtraVar;
        locationId = null;
      }
      const payload = {
        shopify_token: platformObj.shopToken,
        shop_name: platformObj.shopName,
        shopify_order_id: shopifyOrderId,
        tracking_number: trackingObj.tracking_id,
        status: currentStatus,
        need_fulfillment: false,
        courier_used: PARENT_CHILD_COURIER_MAPS[trackingObj.courier_used],
        location_id: locationId,
        currency: "INR",
        amount: `${trackingObj.info?.cod_amount} || 0`,
      };
      if (
        trackingObj.shopPlatform.fulfillment_status === currentStatus &&
        trackingObj.shopPlatform.fulfillmentStatus === locationId
      )
        payload.need_fulfillment = true;
      if (
        trackingObj.user.authToken in ["10875444a8ba8ff3d691b6685efb9b6d137249"] &&
        currentStatus !== ["OP", "OM"]
      )
        payload.need_fulfillment = true;

      const URL = "https://cfapi.pickrr.com/plugins/shopify/update-order-status/";

      const makeApiCall = new MakeAPICall(URL, payload, undefined, payload, 2);
      const response = await makeApiCall.post();

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateClientEcwidStoreOrderStatus(trackingObj, platformObj, currentStatus) {
    try {
      const payload = {
        store_id: platformObj.shopToken, // TODO
        client_order_id: trackingObj.client_order_id,
        tracking_id: trackingObj.tracking_id,
        status: currentStatus,
      };
      const URL = "https://cfapi.pickrr.com/plugins/ecwid/update-order-status/";
      const makeApiCall = new MakeAPICall(URL, payload);
      const response = await makeApiCall.post();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}

/** */
class PlatformClients extends UpdatePlatformClients {
  constructor(trackingObj) {
    super();
    this.trackingObj = trackingObj;
  }

  static getPlatformFuncMap(platformName) {
    const mappings = {
      ecwid: this.updateClientEcwidStoreOrderStatus,
      shopify: this.updateClientShopifyStoreOrderStatus,
      magento_v2: this.updateClientMagento2Store,
      easyecom: this.updateClientEasyecomStore,
      opencart: this.updateClientOpencartStore,
      bikayi: this.updateClientBikayiStoreOrderStatus,
    };
    return mappings[platformName];
  }

  init() {
    const currentStatus = getCurrentTrackStatus(this.trackingObj);
    switch (true) {
      case this.trackingObj.shopPlatform === "instamojo": {
        this.updateInstamojoOrderStatus(this.trackingObj, currentStatus);
        break;
      }
      case this.trackingObj.shopPlatform === "zoho-inventory": {
        this.updateZohoInventoryOrderStatus(this.trackingObj, currentStatus);
        break;
      }
      case this.trackingObj.shopPlatform === "zoho": {
        this.updateZohoOrderStatus(this.trackingObj, currentStatus);
        break;
      }
      default:
        if (
          this.trackingObj.woocomPlatform &&
          this.trackingObj.woocomPlatform.updated_tracking_status
        ) {
          const clientStatus = getWoocomClientStatus(this.trackingObj);
          const clientOrderId = this.trackingObj.client_extra_var;
          if (clientStatus) {
            this.updateOrderStatusOnWoocom(
              this.trackingObj.woocomPlatform,
              clientStatus,
              clientOrderId
            );
          }
        } else {
          const platForm = this.trackingObj.shopPlatform;
          if (platForm && this.trackingObj.hasWebhook && currentStatus) {
            const platFormFunction = this.getPlatformFuncMap(platForm.shop_platform);
            platFormFunction(this.trackingObj, platForm, currentStatus);
          }
        }
        break;
    }
  }
}

module.exports = {
  PlatformClients,
};

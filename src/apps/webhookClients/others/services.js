import MakeApiCall from '../utils/helpers.js'
import getCurrentTrackStatus from './helpers'
import CV from './constant'
const moment = require("moment");

class UpdateClients {
    updateInstamojoTracking(trackingObj, client) {
        courier_map = CV
        try {
            instamojo_dict = {
                "auth_token": client.auth_token,
                "order_id": trackingObj.client_extra_var,
                "tracking_number": trackingObj.tracking_id,
                "carrier": courier_map[trackingObj.courier_used],
                "tracking_url": "https://pickrr.com/tracking/#/?tracking_id={trackingObj.tracking_id}"
            }
            url = "https://cfapi.pickrr.com/plugins/instamojo/api/v1/update-order-tracking/"
            let update = new MakeApiCall(url, instamojo_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateInstamojoOrder(trackingObj, client, current_status) {
        try {
            url = 'https://cfapi.pickrr.com/plugins/instamojo/api/v1/update-order-status/'
            order_update_body = {
                'order_status': current_status,
                'order_id': trackingObj.client_extra_var,
                'auth_token': client.auth_token
            }
            let update = new MakeApiCall(url, order_update_body)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateZohoInventoryOrder(trackingObj, client, current_status) {
        try {
            url = 'https://cfapi.pickrr.com/plugins/zoho-inventory/api/v1/update-order-status/'
            client_extra_var = json.parse(trackingObj.client_extra_var)
            shop_name = client_extra_var.get('shop_name')
            platform_order_id = client_extra_var.get('platform_order_id')
            order_update_body = {
                'order_status': current_status,
                'platform_order_id': platform_order_id,
                'auth_token': client.auth_token,
                'shop_name': shop_name
            }
            if (current_status == 'DL' || current_status == 'OC') {
                let update = new MakeApiCall(url, order_update_body)
                response = update.post()
                return response
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateZohoOrder(trackingObj, client, current_status) {
        try {
            url = 'https://cfapi.pickrr.com//plugins/zoho/update-order-status/'
            client_extra_var = json.parse(trackingObj.client_extra_var)
            platform_order_id = client_extra_var.get('platform_order_id')
            if (trackingObj.delivery_date) {
                delivery_date = trackingObj.delivery_date.moment(date, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY HH:mm");
            }
            else {
                delivery_date = none;
            }
            order_update_body = {
                'order_status': current_status,
                'order_id': platform_order_id,
                'auth_token': client.auth_token,
                'shop_name': client_extra_var.get("shop_name"),
                'delivery_date': delivery_date,
                'tracking_number': trackingObj.tracking_id,
                'tracking_url': "https://pickrr.com/tracking/#/?tracking_id=${trackingObj.tracking_id}",
                'shipment_date': trackingObj.pickup_time.moment(date, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY HH:mm"),
                'carrier': trackingObj.courier_used
            }
            if (["DL", "OT"].includes(current_status)) {
                let update = new MakeApiCall(url, order_update_body)
                response = update.post()
                return response
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    getWoocomBase(store_name) {
        if (store_name.startswith() == "http") {
            return "${store_name}/wp/json/wc/3"
        }
        else {
            return "https://${store_name}/wp-json/wc/v3"
        }
    }
    updateOrderStatusOnWoocom(woocom_user, status, client_order_id) {
        try {
            Username = (woocom_user.username).toString()
            Password = (woocom_user.password).toString()
            store_name = (woocom_user.store_name).toString()
            const REQUEST_TIMEOUT
            if (store_name in WOOCOM_TIMEOUT_STORE_LIST)
                REQUEST_TIMEOUT = 10
            status = status
            order_id = client_order_id
            data = {
                "status": status
            }
            const str1 = this.getWoocomBase(store_name)
            url = str1.concat('/orders/${order_id}')
            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
            }
            url += "?consumer_key=${Username}&consumer_secret=${Password}"
            try {
                let response = new MakeApiCall(url, data, headers, timeout = REQUEST_TIMEOUT)
                order_response = response.put()
            }
            catch {
                let response = new MakeApiCall(url, data, headers, timeout = REQUEST_TIMEOUT)
                order_response = response.post()
            }
            return order_response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientBikayiStore(trackingObj, platform_obj, current_status, client) {
        try {
            bikayi_dict = {
                "auth_token": client.auth_token,
                "order_id": trackingObj.client_order_id,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/bikayi/update-order-status/"
            let update = new MakeApiCall(url, bikayi_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientOpencartStore(trackingObj, platform_obj, current_status, client) {
        try {
            opencart_dict = {
                "auth_token": client.auth_token,
                "order_id": trackingObj.client_order_id,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/opencart/update-order-status/"
            let update = new MakeApiCall(url, opencart_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientEasyecomStore(trackingObj, platform_obj, current_status, client) {
        try {
            easyecom_dict = {
                "auth_token": client.auth_token,
                "order_id": trackingObj.client_extra_var,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/easyecom/amazon/update-order-status/"
            let update = new MakeApiCall(url, easycom_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientMagento2Store(trackingObj, platform_obj, current_status, client) {
        try {
            magento2_dict = {
                "auth_token": client.auth_token,
                "website_url": platform_obj.shop_name,
                "order_id": trackingObj.client_extra_var,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/magento2/update-order-status/"
            let update = new MakeApiCall(url, magento2_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }

    updateClientShopifyStore(trackingObj, platform_obj, current_status, client) {
        try {
            courier_map = CV
            if (client.shop_platform !== null) {
                store_name = None
                if ("-loc:" in trackingObj.client_extra_var) {
                    shopify_order_id = trackingObj.client_extra_var.split('-loc:')[0]
                    if ("-s-:" in trackingObj.client_extra_var) {
                        store_name = trackingObj.client_extra_var.split('-s-:')[1]
                        location_id = trackingObj.client_extra_var.split('-loc:')[1].split('-s-:')[0]
                    }
                    else
                        location_id = trackingObj.client_extra_var.split('-loc:')[1]
                }
                else {
                    shopify_order_id = trackingObj.client_extra_var
                    location_id = None
                }
                shopify_dict = {
                    "shop_name": store_name,
                    "shopify_order_id": shopify_order_id,
                    "tracking_number": trackingObj.tracking_id,
                    "status": current_status,
                    "courier_used": courier_map[trackingObj.courier_used],
                    "location_id": location_id,
                    "currency": "INR",
                    "amount": (trackingObj.cod_amount).toString(),
                    "auth_token": trackingObj.user.auth_token,
                    "v2": True
                }
                url = "https://cfapi.pickrr.com/plugins/shopify/v2/update-order-status/"
                url += "?"
                for (key, value in shopify_dict.items()) {
                    str1 = key.toString()
                    str2 = value.toString()
                    url = str1.concat('=', str2, '&')
                }
                let update = new MakeApiCall(url, shopify_dict)
                response = update.post()
                return response
            }
            if ("-loc:" in trackingObj.client_extra_var) {
                shopify_order_id = trackingObj.client_extra_var.split('-loc:')[0]
                location_id = trackingObj.client_extra_var.split('-loc:')[1]
            }
            else {
                shopify_order_id = trackingObj.client_extra_var
                location_id = None
            }
            shopify_dict = {
                "shopify_token": platform_obj.shop_token,
                "shop_name": platform_obj.shop_name,
                "shopify_order_id": shopify_order_id,
                "tracking_number": trackingObj.tracking_id,
                "status": current_status,
                "need_fulfillment": False,
                "courier_used": courier_map[trackingObj.courier_used],
                "location_id": location_id,
                "currency": "INR",
                "amount": (trackingObj.cod_amount).toString()
            }
            if (client.shop_platform.fulfillment_status == current_status && client.shop_platform.fulfillment_status == location_id)
                shopify_dict["need_fulfillment"] = True
            if (trackingObj.user.auth_token in ["10875444a8ba8ff3d691b6685efb9b6d137249"] && current_status !== ["OP", "OM"])
                shopify_dict["need_fulfillment"] = True
            url = "https://cfapi.pickrr.com/plugins/shopify/update-order-status/"
            url += "?"
            for (key, value in shopify_dict.items()) {
                str1 = key.toString()
                str2 = value.toString()
                url = str1.concat('=', str2, '&')
            }
            let update = new MakeApiCall(url, shopify_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }

    trackUpdatesToClientShopify(trackingObj) {
        try {
            courier_map = CV
            if ("-loc:" in trackingObj.client_extra_var) {
                shopify_order_id = trackingObj.client_extra_var.split('-loc:')[0]
                location_id = trackingObj.client_extra_var.split('-loc:')[1]
            }
            else {
                shopify_order_id = trackingObj.client_extra_var
                location_id = None
            }
            platform_obj = trackingObj.user.shop_platform
            const status
            if (trackingObj.delivery_date) {
                status = "DL"
            }
            else {
                status = "OT"
            }
            shopify_dict = {
                "shopify_token": platform_obj.shop_token,
                "shop_name": platform_obj.shop_name,
                "shopify_order_id": shopify_order_id,
                "tracking_number": trackingObj.tracking_id,
                "status": status,
                "need_fulfillment": True,
                "courier_used": courier_map[trackingObj.courier_used],
                "location_id": location_id,
                "currency": "INR",
                "amount": 0,
                "notify_customer": False,
                "periodic": True
            }
            url = "https://cfapi.pickrr.com/plugins/shopify/update-order-status/"
            url += "?"
            for (key, value in shopify_dict.items()) {
                str1 = key.toString()
                str2 = value.toString()
                url = str1.concat('=', str2, '&')
            }
            let update = new MakeApiCall(url, shopify_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientEcwidStore(trackingObj, platform_obj, current_status, client) {
        try {
            ecwid_dict = {
                "store_id": platform_obj.shop_token,
                "client_order_id": trackingObj.client_order_id,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/ecwid/update-order-status/"
            let update = new MakeApiCall(url, ecwid_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
}

class OtherClienUpdate extends UpdateClients {
    constructor(trackingObj) {
        super();
        this.trackingObj = trackingObj;
    }
    platform_func_map = {
        "ecwid": this.updateClientEcwidStore(),
        "shopify": this.updateClientShopifyStore(),
        "magento_v2": this.updateClientMagento2Store(),
        "easyecom": this.updateClientEasyecomStore(),
        "opencart": this.updateClientOpencartStore(),
        "bikayi": this.updateClientBikayiStore()
    }
    client = this.trackingObj.user
    init() {
        switch (true) {
            case this.trackingObj.shop_platform === 'instamojo':
                current_status = getCurrentTrackStatus(this.trackingObj)
                this.updateInstamojoOrder(this.trackingObj, client, current_status);
                break;
            case this.trackingObj.shop_platform === 'zoho-inventory':
                current_status = getCurrentTrackStatus(this.trackingObj)
                this.updateZohoInventoryOrder(this.trackingObj, client, current_status);
                break;
            case this.trackingObj.shop_platform === 'zoho':
                current_status = getCurrentTrackStatus(this.trackingObj)
                this.updateZohoOrder(this.trackingObj, client, current_status);
                break;
            case this.trackingObj.shop_platform:
                if (client.woocom_platform && client.woocom_platform.update_tracking_status) {
                    try {
                        client_order_id = trackingObj.client_extra_var
                        client_woocom_obj = client.woocom_platform
                        current_status = getCurrentTrackStatus(trackingObj)
                        client_status = None
                        if (current_status !== null)
                            return False
                        if (current_status == "PP") {
                            if (client_woocom_obj.picked_up)
                                client_status = client_woocom_obj.picked_up
                        }
                        else if (current_status == "OT") {
                            if (client_woocom_obj.transit)
                                client_status = client_woocom_obj.transit
                        }
                        else if (current_status == "RTO") {
                            if (client_woocom_obj.rto)
                                client_status = client_woocom_obj.rto
                        }
                        else if (current_status == "OC") {
                            if (client_woocom_obj.cancelled)
                                client_status = client_woocom_obj.cancelled
                        }
                        else if (current_status == "DL") {
                            if (client_woocom_obj.delivered)
                                client_status = client_woocom_obj.delivered
                        }
                        else if (current_status == "RTD") {
                            if (client_woocom_obj.rtd)
                                client_status = client_woocom_obj.rtd
                        }
                        else if (current_status == "OP") {
                            if (client_woocom_obj.order_placed)
                                client_status = client_woocom_obj.order_placed
                        }
                        if (client_status) {
                            res = this.updateOrderStatusOnWoocom(client_woocom_obj, client_status, client_order_id)
                            return res
                        }
                    }
                    catch (error) {
                        throw new Error(error);
                    }
                }
                else {
                    platform = client.shop_platform
                    if (platform && client.has_webhook) {
                        current_status = getCurrentTrackStatus(trackingObj)
                        if (current_status) {
                            platform_func_map[platform.shop_platform](trackingObj, platform, current_status, client)
                        }
                    }
                }
                break;
        }
    }
}

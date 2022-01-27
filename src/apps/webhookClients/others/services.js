import MakeApiCall from '../utils/helpers.js'
import get_current_track_status from './helpers'
import cv from './constant'
const moment = require("moment");

class UpdateClients {
    update_instamojo_tracking(trackingObj, client) {
        courier_map = cv
        try {
            instamojo_dict = {
                "auth_token": client.mobile_token,
                "order_id": trackingObj.order.client_extra_var,
                "tracking_number": trackingObj.tracking_id,
                "carrier": courier_map[trackingObj.order.courier_used],
                "tracking_url": "https://pickrr.com/tracking/#/?tracking_id={trackingObj.tracking_id}"
            }
            url = "https://cfapi.pickrr.com/plugins/instamojo/api/v1/update-order-tracking/"
            let update = new MakeApiCall(url, payload = instamojo_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    update_instamojo_order(trackingObj, client, current_status) {
        try {
            url = 'https://cfapi.pickrr.com/plugins/instamojo/api/v1/update-order-status/'
            order_update_body = {
                'order_status': current_status,
                'order_id': trackingObj.order.client_extra_var,
                'auth_token': client.mobile_token
            }
            let update = new MakeApiCall(url, payload = order_update_body)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    update_zoho_inventory_order(trackingObj, client, current_status) {
        try {
            url = 'https://cfapi.pickrr.com/plugins/zoho-inventory/api/v1/update-order-status/'
            client_extra_var = json.parse(trackingObj.order.client_extra_var)
            shop_name = client_extra_var.get('shop_name')
            platform_order_id = client_extra_var.get('platform_order_id')
            order_update_body = {
                'order_status': current_status,
                'platform_order_id': platform_order_id,
                'auth_token': client.mobile_token,
                'shop_name': shop_name
            }
            if (current_status == 'DL' || current_status == 'OC') {
                let update = new MakeApiCall(url, payload = order_update_body)
                response = update.post()
                return response
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    update_zoho_order(trackingObj, client, current_status) {
        try {
            url = 'https://cfapi.pickrr.com//plugins/zoho/update-order-status/'
            client_extra_var = json.parse(trackingObj.order.client_extra_var)
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
                'auth_token': client.mobile_token,
                'shop_name': client_extra_var.get("shop_name"),
                'delivery_date': delivery_date,
                'tracking_number': trackingObj.tracking_id,
                'tracking_url': "https://pickrr.com/tracking/#/?tracking_id=${trackingObj.tracking_id}",
                'shipment_date': trackingObj.pickup_time.moment(date, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY HH:mm"),
                'carrier': trackingObj.order.courier_used
            }
            if (current_status == 'DL' || current_status == 'OT') {
                let update = new MakeApiCall(url, payload = order_update_body)
                response = update.post()
                return response
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    get_woocom_base(store_name) {
        if (store_name.startswith() == "http") {
            return "${store_name}/wp/json/wc/3"
        }
        else {
            return "https://${store_name}/wp-json/wc/v3"
        }
    }
    update_order_status_on_woocom(woocom_user, status, client_order_id) {
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
            const str1 = this.get_woocom_base(store_name)
            url = str1.concat('/orders/${order_id}')
            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
            }
            url += "?consumer_key=${Username}&consumer_secret=${Password}"
            try {
                let response = new MakeApiCall(url, payload = data, headers = headers, timeout = REQUEST_TIMEOUT)
                order_response = response.put()
            }
            catch {
                let response = new MakeApiCall(url, payload = data, headers = headers, timeout = REQUEST_TIMEOUT)
                order_response = response.post()
            }
            return order_response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    update_client_bikayi_store(trackingObj, platform_obj, current_status, client) {
        try {
            bikayi_dict = {
                "auth_token": client.mobile_token,
                "order_id": trackingObj.order.client_order_id,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/bikayi/update-order-status/"
            let update = new MakeApiCall(url, payload = bikayi_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    update_client_opencart_store(trackingObj, platform_obj, current_status, client) {
        try {
            opencart_dict = {
                "auth_token": client.mobile_token,
                "order_id": trackingObj.order.client_order_id,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/opencart/update-order-status/"
            let update = new MakeApiCall(url, payload = opencart_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    update_client_easyecom_store(trackingObj, platform_obj, current_status, client) {
        try {
            easyecom_dict = {
                "auth_token": client.mobile_token,
                "order_id": trackingObj.order.client_extra_var,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/easyecom/amazon/update-order-status/"
            let update = new MakeApiCall(url, payload = easycom_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    update_client_magento2_store(trackingObj, platform_obj, current_status, client) {
        try {
            magento2_dict = {
                "auth_token": client.mobile_token,
                "website_url": platform_obj.shop_name,
                "order_id": trackingObj.order.client_extra_var,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/magento2/update-order-status/"
            let update = new MakeApiCall(url, payload = magento2_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }

    update_client_shopify_store(trackingObj, platform_obj, current_status, client) {
        try {
            courier_map = cv
            if (client.shop_platform !== null) {
                store_name = None
                if ("-loc:" in trackingObj.order.client_extra_var) {
                    shopify_order_id = trackingObj.order.client_extra_var.split('-loc:')[0]
                    if ("-s-:" in trackingObj.order.client_extra_var) {
                        store_name = trackingObj.order.client_extra_var.split('-s-:')[1]
                        location_id = trackingObj.order.client_extra_var.split('-loc:')[1].split('-s-:')[0]
                    }
                    else
                        location_id = trackingObj.order.client_extra_var.split('-loc:')[1]
                }
                else {
                    shopify_order_id = trackingObj.order.client_extra_var
                    location_id = None
                }
                shopify_dict = {
                    "shop_name": store_name,
                    "shopify_order_id": shopify_order_id,
                    "tracking_number": trackingObj.tracking_id,
                    "status": current_status,
                    "courier_used": courier_map[trackingObj.order.courier_used],
                    "location_id": location_id,
                    "currency": "INR",
                    "amount": (trackingObj.order.cod_amount).toString(),
                    "auth_token": trackingObj.order.user.mobile_token,
                    "v2": True
                }
                url = "https://cfapi.pickrr.com/plugins/shopify/v2/update-order-status/"
                url += "?"
                for (key, value in shopify_dict.items()) {
                    str1 = key.toString()
                    str2 = value.toString()
                    url = str1.concat('=', str2, '&')
                }
                let update = new MakeApiCall(url, payload = shopify_dict)
                response = update.post()
                return response
            }
            if ("-loc:" in trackingObj.order.client_extra_var) {
                shopify_order_id = trackingObj.order.client_extra_var.split('-loc:')[0]
                location_id = trackingObj.order.client_extra_var.split('-loc:')[1]
            }
            else {
                shopify_order_id = trackingObj.order.client_extra_var
                location_id = None
            }
            shopify_dict = {
                "shopify_token": platform_obj.shop_token,
                "shop_name": platform_obj.shop_name,
                "shopify_order_id": shopify_order_id,
                "tracking_number": trackingObj.tracking_id,
                "status": current_status,
                "need_fulfillment": False,
                "courier_used": courier_map[trackingObj.order.courier_used],
                "location_id": location_id,
                "currency": "INR",
                "amount": (trackingObj.order.cod_amount).toString()
            }
            if (client.shop_platform.fulfillment_status == current_status && client.shop_platform.fulfillment_status == location_id)
                shopify_dict["need_fulfillment"] = True
            if (trackingObj.order.user.mobile_token in ["10875444a8ba8ff3d691b6685efb9b6d137249"] && current_status !== ["OP", "OM"])
                shopify_dict["need_fulfillment"] = True
            url = "https://cfapi.pickrr.com/plugins/shopify/update-order-status/"
            url += "?"
            for (key, value in shopify_dict.items()) {
                str1 = key.toString()
                str2 = value.toString()
                url = str1.concat('=', str2, '&')
            }
            let update = new MakeApiCall(url, payload = shopify_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }

    track_updates_to_client_shopify(trackingObj) {
        try {
            courier_map = cv
            if ("-loc:" in trackingObj.order.client_extra_var) {
                shopify_order_id = trackingObj.order.client_extra_var.split('-loc:')[0]
                location_id = trackingObj.order.client_extra_var.split('-loc:')[1]
            }
            else {
                shopify_order_id = trackingObj.order.client_extra_var
                location_id = None
            }
            platform_obj = trackingObj.order.user.shop_platform
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
                "courier_used": courier_map[trackingObj.order.courier_used],
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
            let update = new MakeApiCall(url, payload = shopify_dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    update_client_ecwid_store(trackingObj, platform_obj, current_status, client) {
        try {
            ecwid_dict = {
                "store_id": platform_obj.shop_token,
                "client_order_id": trackingObj.order.client_order_id,
                "tracking_id": trackingObj.tracking_id,
                "status": current_status
            }
            url = "https://cfapi.pickrr.com/plugins/ecwid/update-order-status/"
            let update = new MakeApiCall(url, payload = ecwid_dict)
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
        "ecwid": this.update_client_ecwid_store(),
        "shopify": this.update_client_shopify_store(),
        "magento_v2": this.update_client_magento2_store(),
        "easyecom": this.update_client_easyecom_store(),
        "opencart": this.update_client_opencart_store(),
        "bikayi": this.update_client_bikayi_store()
    }
    client = this.trackingObj.order.user
    init() {
        switch (true) {
            case this.trackingObj.order.shop_platform === 'instamojo':
                current_status = get_current_track_status(this.trackingObj)
                this.update_instamojo_order(this.trackingObj, client, current_status);
                break;
            case this.trackingObj.order.shop_platform === 'zoho-inventory':
                current_status = get_current_track_status(this.trackingObj)
                this.update_zoho_inventory_order(this.trackingObj, client, current_status);
                break;
            case this.trackingObj.order.shop_platform === 'zoho':
                current_status = get_current_track_status(this.trackingObj)
                this.update_zoho_order(this.trackingObj, client, current_status);
                break;
            case this.trackingObj.order.shop_platform:
                if (client.woocom_platform && client.woocom_platform.update_tracking_status) {
                    try {
                        client_order_id = trackingObj.order.client_extra_var
                        client_woocom_obj = client.woocom_platform
                        current_status = get_current_track_status(trackingObj)
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
                            res = this.update_order_status_on_woocom(client_woocom_obj, client_status, client_order_id)
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
                        current_status = get_current_track_status(trackingObj)
                        if (current_status) {
                            platform_func_map[platform.shop_platform](trackingObj, platform, current_status, client)
                        }
                    }
                }
                break;
        }
    }
}

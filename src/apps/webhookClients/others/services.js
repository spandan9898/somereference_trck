import MakeApiCall from '../utils/helpers.js'
import getCurrentTrackStatus from './helpers'
import CV from './constants'
const moment = require("moment");

class UpdateClients {
    updateInstamojoTracking = (trackingObj, client) => {
        const courierMap = CV
        try {
            instamojoDict = {
                "auth_token": client.auth_token,
                "order_id": trackingObj.clientExtraVar,
                "tracking_number": trackingObj.trackingId,
                "carrier": courierMap[trackingObj.courierUsed],
                "tracking_url": `https://pickrr.com/tracking/#/?tracking_id=${trackingObj.trackingId}`
            }
            url = "https://cfapi.pickrr.com/plugins/instamojo/api/v1/update-order-tracking/"
            let update = new MakeApiCall(url, instamojoDict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateInstamojoOrder = (trackingObj, client, currentStatus) => {
        try {
            url = 'https://cfapi.pickrr.com/plugins/instamojo/api/v1/update-order-status/'
            orderUpdateBody = {
                'order_status': currentStatus,
                'order_id': trackingObj.clientExtraVar,
                'auth_token': client.auth_token
            }
            let update = new MakeApiCall(url, orderUpdateBody)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateZohoInventoryOrder = (trackingObj, client, currentStatus) => {
        try {
            url = 'https://cfapi.pickrr.com/plugins/zoho-inventory/api/v1/update-order-status/'
            clientExtraVar = json.parse(trackingObj.clientExtraVar)
            shopName = clientExtraVar.get('shop_name')
            platformOrderId = clientExtraVar.get('platform_order_id')
            orderUpdateBody = {
                'order_status': currentStatus,
                'platform_order_id': platformOrderId,
                'auth_token': client.auth_token,
                'shop_name': shopName
            }
            if (currentStatus == 'DL' || currentStatus == 'OC') {
                let update = new MakeApiCall(url, orderUpdateBody)
                response = update.post()
                return response
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateZohoOrder = (trackingObj, client, currentStatus) => {
        try {
            url = 'https://cfapi.pickrr.com//plugins/zoho/update-order-status/'
            clientExtraVar = json.parse(trackingObj.clientExtraVar)
            platformOrderId = clientExtraVar.get('platform_order_id')
            if (trackingObj.deliveryDate) {
                const deliveryDate = trackingObj.deliveryDate.moment("YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY HH:mm");
            }
            else {
                deliveryDate = none;
            }
            orderUpdateBody = {
                'order_status': currentStatus,
                'order_id': platformOrderId,
                'auth_token': client.auth_token,
                'shop_name': clientExtraVar.get("shop_name"),
                'delivery_date': deliveryDate,
                'tracking_number': trackingObj.trackingId,
                'tracking_url': `https://pickrr.com/tracking/#/?tracking_id=${trackingObj.tracking_id}`,
                'shipment_date': trackingObj.pickupTime.moment("YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY HH:mm"),
                'carrier': trackingObj.courierUsed
            }
            if (["DL", "OT"].includes(currentStatus)) {
                let update = new MakeApiCall(url, orderUpdateBody)
                response = update.post()
                return response
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    getWoocomBase = (storeName) => {
        if (storeName.startswith() == "http") {
            return `${store_name}/wp/json/wc/3`
        }
        else {
            return `https://${store_name}/wp-json/wc/v3`
        }
    }
    updateOrderStatusOnWoocom = (woocomUser, status, clientOrderId) => {
        try {
            const Username = (woocomUser.username).toString()
            const Password = (woocomUser.password).toString()
            const storeName = (woocomUser.storeName).toString()
            const REQUESTTIMEOUT
            if (store_name in WOOCOMTIMEOUTSTORELIST)
                REQUESTTIMEOUT = 10
            status = status
            orderId = clientOrderId
            data = {
                "status": status
            }
            const str1 = this.getWoocomBase(storeName)
            url = str1.concat(`/orders/${order_id}`)
            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
            }
            url += `?consumer_key=${Username}&consumer_secret=${Password}`
            try {
                let response = new MakeApiCall(url, data, headers, timeout = REQUESTTIMEOUT)
                orderResponse = response.put()
            }
            catch {
                let response = new MakeApiCall(url, data, headers, timeout = REQUESTTIMEOUT)
                orderResponse = response.post()
            }
            return orderResponse
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientBikayiStore = (trackingObj, platformObj, currentStatus, client) => {
        try {
            bikayiDict = {
                "auth_token": client.auth_token,
                "order_id": trackingObj.clientOrderId,
                "tracking_id": trackingObj.trackingId,
                "status": currentStatus
            }
            url = "https://cfapi.pickrr.com/plugins/bikayi/update-order-status/"
            let update = new MakeApiCall(url, bikayiDict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientOpencartStore = (trackingObj, platformObj, currentStatus, client) => {
        try {
            opencartDict = {
                "auth_token": client.auth_token,
                "order_id": trackingObj.clientOrderId,
                "tracking_id": trackingObj.trackingId,
                "status": currentStatus
            }
            url = "https://cfapi.pickrr.com/plugins/opencart/update-order-status/"
            let update = new MakeApiCall(url, opencartDict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientEasyecomStore = (trackingObj, platformObj, currentStatus, client) => {
        try {
            easyecomDict = {
                "auth_token": client.auth_token,
                "order_id": trackingObj.clientExtraVar,
                "tracking_id": trackingObj.trackingId,
                "status": currentStatus
            }
            url = "https://cfapi.pickrr.com/plugins/easyecom/amazon/update-order-status/"
            let update = new MakeApiCall(url, easycomDict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientMagento2Store = (trackingObj, platformObj, currentStatus, client) => {
        try {
            magento2Dict = {
                "auth_token": client.auth_token,
                "website_url": platformObj.shopName,
                "order_id": trackingObj.clientExtraVar,
                "tracking_id": trackingObj.trackingId,
                "status": currentStatus
            }
            url = "https://cfapi.pickrr.com/plugins/magento2/update-order-status/"
            let update = new MakeApiCall(url, magento2Dict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }

    updateClientShopifyStore = (trackingObj, platformObj, currentStatus, client) => {
        try {
            const courierMap = CV
            if (client.shopPlatform !== null) {
                storeName = None
                if ("-loc:" in trackingObj.clientExtraVar) {
                    shopifyOrderId = trackingObj.clientExtraVar.split('-loc:')[0]
                    if ("-s-:" in trackingObj.clientExtraVar) {
                        storeName = trackingObj.clientExtraVar.split('-s-:')[1]
                        locationId = trackingObj.clientExtraVar.split('-loc:')[1].split('-s-:')[0]
                    }
                    else
                        locationId = trackingObj.clientExtraVar.split('-loc:')[1]
                }
                else {
                    shopifyOrderId = trackingObj.clientExtraVar
                    locationId = None
                }
                shopifyDict = {
                    "shop_name": storeName,
                    "shopify_order_id": shopifyOrderId,
                    "tracking_number": trackingObj.trackingId,
                    "status": currentStatus,
                    "courier_used": courierMap[trackingObj.courierUsed],
                    "location_id": locationId,
                    "currency": "INR",
                    "amount": (trackingObj.codAmount).toString(),
                    "auth_token": trackingObj.user.auth_token,
                    "v2": True
                }
                url = "https://cfapi.pickrr.com/plugins/shopify/v2/update-order-status/"
                url += "?"
                for (key, value in shopifyDict.items()) {
                    str1 = key.toString()
                    str2 = value.toString()
                    url = str1.concat('=', str2, '&')
                }
                let update = new MakeApiCall(url, shopifyDict)
                response = update.post()
                return response
            }
            if ("-loc:" in trackingObj.clientExtraVar) {
                shopifyOrderId = trackingObj.clientExtraVar.split('-loc:')[0]
                locationId = trackingObj.clientExtraVar.split('-loc:')[1]
            }
            else {
                shopifyOrderId = trackingObj.clientExtraVar
                locationId = None
            }
            shopify_dict = {
                "shopify_token": platformObj.shopToken,
                "shop_name": platformObj.shopName,
                "shopify_order_id": shopifyOrderId,
                "tracking_number": trackingObj.trackingId,
                "status": currentStatus,
                "need_fulfillment": False,
                "courier_used": courierMap[trackingObj.courierUsed],
                "location_id": locationId,
                "currency": "INR",
                "amount": (trackingObj.codAmount).toString()
            }
            if (client.shopPlatform.fulfillment_status == currentStatus && client.shopPlatform.fulfillmentStatus == location_id)
                shopifyDict["need_fulfillment"] = True
            if (trackingObj.user.authToken in ["10875444a8ba8ff3d691b6685efb9b6d137249"] && currentStatus !== ["OP", "OM"])
                shopifyDict["need_fulfillment"] = True
            url = "https://cfapi.pickrr.com/plugins/shopify/update-order-status/"
            url += "?"
            for (key, value in shopifyDict.items()) {
                str1 = key.toString()
                str2 = value.toString()
                url = str1.concat('=', str2, '&')
            }
            let update = new MakeApiCall(url, shopifyDict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }

    trackUpdatesToClientShopify = (trackingObj) => {
        try {
            const courierMap = CV
            if ("-loc:" in trackingObj.clientExtraVar) {
                shopifyOrderId = trackingObj.clientExtraVar.split('-loc:')[0]
                locationId = trackingObj.clientExtraVar.split('-loc:')[1]
            }
            else {
                shopifyOrderId = trackingObj.clientExtraVar
                locationId = None
            }
            platformObj = trackingObj.user.shopPlatform
            const status
            if (trackingObj.deliveryDate) {
                status = "DL"
            }
            else {
                status = "OT"
            }
            shopifyDict = {
                "shopify_token": platform_obj.shopToken,
                "shop_name": platformObj.shop_Name,
                "shopify_order_id": shopifyOrderId,
                "tracking_number": trackingObj.trackingId,
                "status": status,
                "need_fulfillment": True,
                "courier_used": courierMap[trackingObj.courierUsed],
                "location_id": locationId,
                "currency": "INR",
                "amount": 0,
                "notify_customer": False,
                "periodic": True
            }
            url = "https://cfapi.pickrr.com/plugins/shopify/update-order-status/"
            url += "?"
            for (key, value in shopifyDict.items()) {
                str1 = key.toString()
                str2 = value.toString()
                url = str1.concat('=', str2, '&')
            }
            let update = new MakeApiCall(url, shopifyDict)
            response = update.post()
            return response
        }
        catch (error) {
            throw new Error(error);
        }
    }
    updateClientEcwidStore = (trackingObj, platformObj, currentStatus, client) => {
        try {
            ecwidDict = {
                "store_id": platformObj.shopToken,
                "client_order_id": trackingObj.clientOrderId,
                "tracking_id": trackingObj.trackingId,
                "status": currentStatus
            }
            url = "https://cfapi.pickrr.com/plugins/ecwid/update-order-status/"
            let update = new MakeApiCall(url, ecwidDict)
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
    platformFuncMap = {
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
            case this.trackingObj.shopPlatform === 'instamojo':
                currentStatus = getCurrentTrackStatus(this.trackingObj)
                this.updateInstamojoOrder(this.trackingObj, client, currentStatus);
                break;
            case this.trackingObj.shopPlatform === 'zoho-inventory':
                currentStatus = getCurrentTrackStatus(this.trackingObj)
                this.updateZohoInventoryOrder(this.trackingObj, client, currentStatus);
                break;
            case this.trackingObj.shopPlatform === 'zoho':
                currentStatus = getCurrentTrackStatus(this.trackingObj)
                this.updateZohoOrder(this.trackingObj, client, currentStatus);
                break;
            case this.trackingObj.shopPlatform:
                if (client.woocomPlatform && client.woocomPlatform.updateTrackingStatus) {
                    try {
                        clientOrderId = trackingObj.clientExtraVar
                        clientWoocomObj = client.woocomPlatform
                        currentStatus = getCurrentTrackStatus(trackingObj)
                        clientStatus = None
                        if (currentStatus !== null)
                            return False
                        if (currentStatus == "PP") {
                            if (clientWoocomObj.pickedUp)
                                clientStatus = clientWoocomObj.pickedUp
                        }
                        else if (currentStatus == "OT") {
                            if (clientWoocomObj.transit)
                                clientStatus = clientWoocomObj.transit
                        }
                        else if (currentStatus == "RTO") {
                            if (clientWoocomObj.rto)
                                clientStatus = clientWoocomObj.rto
                        }
                        else if (currentStatus == "OC") {
                            if (clientWoocomObj.cancelled)
                                clientStatus = clientWoocomObj.cancelled
                        }
                        else if (currentStatus == "DL") {
                            if (clientWoocomObj.delivered)
                                clientStatus = clientWoocomObj.delivered
                        }
                        else if (currentStatus == "RTD") {
                            if (clientWoocomObj.rtd)
                                clientStatus = clientWoocomObj.rtd
                        }
                        else if (currentStatus == "OP") {
                            if (clientWoocomObj.orderPlaced)
                                clientStatus = clientWoocomObj.orderPlaced
                        }
                        if (clientStatus) {
                            res = this.updateOrderStatusOnWoocom(clientWoocomObj, clientStatus, clientOrderId)
                            return res
                        }
                    }
                    catch (error) {
                        throw new Error(error);
                    }
                }
                else {
                    platform = client.shopPlatform
                    if (platform && client.hasWebhook) {
                        currentStatus = getCurrentTrackStatus(trackingObj)
                        if (currentStatus) {
                            platformFuncMap[platform.shopPlatform](trackingObj, platform, currentStatus, client)
                        }
                    }
                }
                break;
        }
    }
}

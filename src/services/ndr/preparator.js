const _ = require("lodash");
const { convertDatetimeFormat, ofdCount } = require("../../utils");
const { findPickupDate } = require("./helpers");

/**
 *
 * @param {*} trackData
 * @returns
 */
const prepareTrackingEventDictForNDR = (trackData) => {
  const pickupDatetime = findPickupDate(trackData);
  const scanDatetime = trackData?.status?.current_status_time || "";
  const EDDTimestamp = trackData?.edd_stamp || "";
  const trackingEventDict = {
    awb: trackData?.tracking_id,
    EDD: convertDatetimeFormat(EDDTimestamp),
    pickrr_status: trackData?.status?.current_status_type || "",
    pickrr_sub_status_code:
      trackData?.pickrr_sub_status_code ||
      _.get(trackData, "track_arr[0].pickrr_sub_status_code", ""),
    pickup_datetime: convertDatetimeFormat(pickupDatetime),
    received_by: trackData?.status?.received_by,
    scan_datetime: convertDatetimeFormat(scanDatetime),
    scan_type: trackData?.status?.current_status_type || "",
    track_info: trackData?.status?.current_status_body || "",
    track_location: trackData?.status?.current_status_location || "",
    ofd_count: ofdCount(trackData?.track_arr || []) || "",
    courier_name: trackData?.courier_used || "",
  };
  return trackingEventDict;
};

/**
 *
 * @param {*} trackData
 * @returns
 */
const prepareOtherDetailsFromTrackDataForNDR = (trackData) => {
  const eddStamp = trackData?.edd_stamp || "";
  const otherDetailsDict = {
    child_auth_token: trackData?.auth_token || "",
    user_auth_token: trackData?.auth_token || "",
    client_order_id: trackData?.client_order_id || "",
    courier_awb: trackData?.courier_tracking_id || "",
    pickrr_awb: trackData?.tracking_id || "",
    customer_address: trackData?.info?.to_address || "",
    customer_name: trackData?.info?.to_name || "",
    customer_phone: trackData?.info?.to_phone_number || "",
    from_state: trackData?.info?.from_state || "",
    client_name: trackData?.info?.from_name || "",
    user_id: "",
    customer_city: trackData?.info?.to_city || "",
    customer_state: trackData?.info?.to_state || "",
    customer_pincode: trackData?.info?.to_pincode || "",
    from_city: trackData?.info?.from_city || "",
    from_pincode: trackData?.info?.from_pincode || "",
    product_name: trackData?.product_name || "",
    product_sku: trackData?.sku || "",
    order_type: "", // bug in existing system
    service_type: trackData?.dispatch_mode || "",
    cod_amount: trackData?.info?.cod_amount || "",
    invoice_value: trackData?.info?.invoice_value || "",
    zone: trackData?.billing_zone || "",
    edd_stamp: convertDatetimeFormat(eddStamp),
    ops_profile: trackData?.ops_profile || "",
    pickrr_order_id: trackData?.pickrr_order_id || "",
    item_list: trackData?.item_list || [],
    user_email: trackData?.user_email || "",
  };
  return otherDetailsDict;
};

module.exports = {
  prepareTrackingEventDictForNDR,
  prepareOtherDetailsFromTrackDataForNDR,
};

const _ = require("lodash");

const { findPickupDate } = require("./helpers");
const { ofdCount } = require("./helpers");

/**
 *
 * @param {*} trackData
 * @returns
 */
const prepareTrackingEventDictForNDR = (trackData) => {
  const trackingEventDict = {
    awb: trackData?.tracking_id,
    EDD: trackData?.edd_stamp,
    pickrr_status: trackData?.status?.current_status_type,
    pickrr_sub_status_code:
      trackData?.pickrr_sub_status_code ||
      _.get(trackData, "track_arr[0].pickrr_sub_status_code", ""),
    pickup_datetime: findPickupDate(trackData?.track_arr),
    received_by: trackData?.status?.received_by,
    scan_datetime: trackData?.status?.current_status_time,
    scan_type: trackData?.status?.current_status_type,
    track_info: trackData?.status?.current_status_body,
    track_location: trackData?.status?.current_status_body,
    ofd_count: ofdCount(trackData?.track_arr),
    courier_name: trackData?.courier_parent_name,
  };
  return trackingEventDict;
};

/**
 *
 * @param {*} trackData
 * @returns
 */
const prepareOtherDetailsFromTrackDataForNDR = (trackData) => {
  const otherDetailsDict = {
    child_auth_token: trackData?.auth_token,
    user_auth_token: trackData?.auth_token,
    client_order_id: trackData?.client_order_id,
    courier_awb: trackData?.courier_tracking_id,
    pickrr_awb: trackData?.tracking_id,
    customer_address: trackData?.info?.from_address,
    customer_name: trackData?.info?.customer_name,
    client_name: trackData?.info?.courier_name,
    user_id: "",
    customer_city: trackData?.info?.to_city,
    customer_state: trackData?.info?.to_state,
    customer_pincode: trackData?.info?.to_pincode,
    from_city: trackData?.info?.from_city,
    from_pincode: trackData?.info?.from_pincode,
    product_name: trackData?.info?.product_name,
    product_sku: trackData?.sku,
    order_type: "", // bug in existing system
    service_type: trackData?.dispatch_mode,
    cod_amount: trackData?.cod_amount,
    invoice_value: trackData?.info?.invoice_value,
    zone: trackData?.billing_zone,
    edd_stamp: trackData?.edd_stamp,
    ops_profile: trackData?.ops_profile,
  };
  return otherDetailsDict;
};

module.exports = {
  prepareTrackingEventDictForNDR,
  prepareOtherDetailsFromTrackDataForNDR,
};

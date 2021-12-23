/**
 *
 * @param {prepares Filter for tracking and returns to tracking/services} trackingAwb
 */
const PrepareTrackModelFilters = async (trackingAwb) => {
  const query = {
    courier_tracking_id: trackingAwb,
  };
  const projection = {
    breadth: 0,
    is_cod: 0,
    weight: 0,
    item_tax_percentage: 0,
    dispatch_mode: 0,
    client_order_id: 0,
    pickrr_order_id: 0,
    sku: 0,
    item_list: 0,
    order_type: 0,
    hsn_code: 0,
    company_name: 0,
    product_name: 0,
    status: 0,
    info: 0,
    is_reverse: 0,
    courier_used: 0,
    courier_tracking_id: 0,
    height: 0,
    courier_parent_name: 0,
    client_extra_var: 0,
    err: 0,
    track_arr: 0,
    length: 0,
    edd_stamp: 0,
    quantity: 0,
    tracking_id: 0,
    order_created_at: 0,
    created_at: 0,
    courier_parent_weight: 0,
    user_email: 0,
    auth_token: 0,
    website: 0,
    label_logo: 0,
    ewaybill_number: 0,
    is_mps: 0,
    rto_waybill: 0,
    waybill_type: 0,
    pdd_date: 0,
    pickup_address_pk: 0,
    web_address: 0,
    logo: 0,
    billing_zone: 0,
    sync_count: 0,
    show_details: 0,
  };
  return { query, projection };
};

module.exports = { PrepareTrackModelFilters };

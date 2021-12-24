/**
 *
 * @param {prepares Filter for tracking and returns to tracking/services} trackingAwb
 */
const PrepareTrackModelFilters = async (trackingAwb) => {
  const query = {
    courier_tracking_id: trackingAwb,
  };

  const projection = {
    _id: 0,
    audit: 0,
    user_id: 0,
    ops_profile: 0,
    user_pk: 0,
    updated_at: 0,
    auth_token: 0,
    label_logo: 0,
    last_update_logo: 0,
    ewaybill_number: 0,
    is_mps: 0,
    rto_waybill: 0,
    waybill_type: 0,
    pdd_date: 0,
    pickup_address_pk: 0,
  };

  return { query, projection };
};

module.exports = { PrepareTrackModelFilters };

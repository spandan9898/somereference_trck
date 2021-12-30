const { findPickupDate, ofdCount } = require("../v1/helpers");
const {
  prepareTrackingStatus,
  findLatestTrackingInfo,
  findLatestLocation,
  findFirstAttemptedDate,
  findLatestNDRDetails,
  findDeliveryDate,
  findRTODate,
} = require("./helpers");

/**
 *
 * @param {*} trackObj
 */
const prepareDataForReportMongo = (trackData) => {
  const trackingStatus = prepareTrackingStatus(trackData);
  const NDRObject = findLatestNDRDetails(trackData?.track_arr || {});
  const data = {
    pickup_date: findPickupDate(trackData?.track_arr || {}),
    received_by: trackData?.status?.received_by || null,
    current_status: trackingStatus.status_type || "FAILED",
    current_status_update: trackingStatus.status,
    current_status_datetime: trackingStatus.status_datetime,
    out_for_delivery_count: ofdCount(trackData?.track_arr || {}),
    edd_date: trackData?.edd_stamp,
    latest_track_info: findLatestTrackingInfo(trackData),
    latest_location: findLatestLocation(trackData),

    // current logic --> track/webhook_services.py(182), see NDR status scan_datetime

    first_attempt_date: findFirstAttemptedDate(trackData?.track_arr || {}),
    latest_ndr_remark: NDRObject.latest_ndr_remark,
    latest_ndr_date: NDRObject.latest_ndr_date,

    // rto_waybill isn't handled on PULL

    status_pk: trackData?.status_pk,
    delivery_date: findDeliveryDate(trackData?.track_arr || {}),
    rto_date: findRTODate(trackData?.track_arr || {}),
    pickrr_tracking_id: trackData.tracking_id,
  };
  if (!data.status_pk) {
    delete data.status_pk;
  }
  return data;
};

module.exports = { prepareDataForReportMongo };

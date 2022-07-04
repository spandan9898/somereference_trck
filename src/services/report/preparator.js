const moment = require("moment");
const { ofdCount } = require("../../utils");

const { findPickupDate } = require("../v1/helpers");

const {
  prepareTrackingStatus,
  findLatestTrackingInfo,
  findLatestLocation,
  findFirstAttemptedDate,
  findLatestNDRDetails,
  findDeliveryDate,
  findRTODate,
  findFirstNdrDate,
  findQCFailureReason,
} = require("./helpers");

/**
 *
 * @param {*} trackObj
 */
const prepareDataForReportMongo = (trackData, isManualUpdate) => {
  const trackingStatus = prepareTrackingStatus(trackData);
  const NDRObject = findLatestNDRDetails(trackData?.track_arr || {});

  let pickupDate = findPickupDate(trackData);
  if (pickupDate) {
    pickupDate = pickupDate instanceof Date ? pickupDate : moment(pickupDate).toDate();
  }
  const data = {
    pickup_date: pickupDate,
    received_by: trackData?.status?.received_by || null,
    current_status: trackingStatus.status_type || "NA",
    current_status_update: isManualUpdate
      ? trackData?.status?.current_status_body || trackingStatus.status
      : trackingStatus.status,
    current_status_datetime: trackingStatus.status_datetime,
    out_for_delivery_count: ofdCount(trackData?.track_arr || []),
    edd_date: trackData?.edd_stamp,
    latest_track_info: findLatestTrackingInfo(trackData),
    latest_location: findLatestLocation(trackData),
    first_ndr_date: findFirstNdrDate(trackData),
    is_otp_delivered: trackData?.is_otp_delivered || "",
    latest_otp: trackData?.latest_otp || "",

    // current logic --> track/webhook_services.py(182), see NDR status scan_datetime

    first_attempt_date: findFirstAttemptedDate(trackData?.track_arr || {}),
    latest_ndr_remark: NDRObject.latest_ndr_remark,
    latest_ndr_date: NDRObject.latest_ndr_date,

    // rto_waybill isn't handled on PULL

    status_pk: trackData?.status_pk,
    delivery_date: findDeliveryDate(trackData?.track_arr || {}),
    rto_date: findRTODate(trackData?.track_arr || {}),
    pickrr_tracking_id: trackData.tracking_id,
    qc_rejection_reason: findQCFailureReason(trackData?.track_arr || {}),
  };
  if (trackData.promise_edd) {
    data.promise_edd = trackData.promise_edd;
  }
  if (!data.status_pk) {
    delete data.status_pk;
  }
  return data;
};

module.exports = { prepareDataForReportMongo };

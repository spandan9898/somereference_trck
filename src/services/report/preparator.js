const moment = require("moment");
const { ofdCount } = require("../../utils");
const { NDR_STATUS_CODE_TO_REASON_MAPPER } = require("../../utils/constants");

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
  findNDRTrackInfos,
  findLatestRtdDate,
  findTotalAttemptCount,
} = require("./helpers");

/**
 *
 * @param {*} trackObj
 */
const prepareDataForReportMongo = (trackData, isManualUpdate) => {
  const trackingStatus = prepareTrackingStatus(trackData);
  const NDRObject = findLatestNDRDetails(trackData?.track_arr || {});
  const ndrTrackInfos = findNDRTrackInfos(trackData?.track_arr || []);
  const ndrDataSize = ndrTrackInfos.length;
  const totalAttempCount = findTotalAttemptCount(trackData);

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
    first_ndr_subreason: ndrDataSize > 0 ? ndrTrackInfos[0]?.scan_status : "",
    first_ndr_status_code: ndrDataSize > 0 ? ndrTrackInfos[0]?.pickrr_sub_status_code : "",
    first_ndr_reason:
      ndrDataSize > 0
        ? NDR_STATUS_CODE_TO_REASON_MAPPER[ndrTrackInfos[0]?.pickrr_sub_status_code] || "Other"
        : "",

    second_ndr_date: ndrDataSize >= 2 ? ndrTrackInfos[1]?.scan_datetime : "",
    second_ndr_subreason: ndrDataSize >= 2 ? ndrTrackInfos[1]?.scan_status : "",
    second_ndr_status_code: ndrDataSize >= 2 ? ndrTrackInfos[1]?.pickrr_sub_status_code : "",
    second_ndr_reason:
      ndrDataSize >= 2
        ? NDR_STATUS_CODE_TO_REASON_MAPPER[ndrTrackInfos[1]?.pickrr_sub_status_code] || "Other"
        : "",

    third_ndr_date: ndrDataSize >= 3 ? ndrTrackInfos[2]?.scan_datetime : "",
    third_ndr_subreason: ndrDataSize >= 3 ? ndrTrackInfos[2]?.scan_status : "",
    third_ndr_status_code: ndrDataSize >= 3 ? ndrTrackInfos[2]?.pickrr_sub_status_code : "",
    third_ndr_reason:
      ndrDataSize >= 3
        ? NDR_STATUS_CODE_TO_REASON_MAPPER[ndrTrackInfos[2]?.pickrr_sub_status_code] || "Other"
        : "",

    is_otp_delivered: trackData?.is_otp_delivered || "",
    latest_otp: trackData?.latest_otp || "",

    // current logic --> track/webhook_services.py(182), see NDR status scan_datetime

    first_attempt_date: findFirstAttemptedDate(trackData?.track_arr || {}),
    latest_ndr_remark: NDRObject.latest_ndr_remark,
    latest_ndr_date: NDRObject.latest_ndr_date,
    latest_ndr_status_code: NDRObject.latest_ndr_status_code,
    latest_ndr_reason: NDRObject.latest_ndr_reason,
    rto_waybill: trackData?.rto_waybill || "",
    rto_reason: trackData?.rto_reason || "",

    // rto_waybill isn't handled on PULL

    status_pk: trackData?.status_pk,
    delivery_date: findDeliveryDate(trackData?.track_arr || {}),
    rto_date: findRTODate(trackData?.track_arr || {}),
    pickrr_tracking_id: trackData.tracking_id,
    qc_rejection_reason: findQCFailureReason(trackData?.track_arr || {}),
    rtdDate: findLatestRtdDate(trackData?.trackArr || []),
    total_attempt_count: totalAttempCount,
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

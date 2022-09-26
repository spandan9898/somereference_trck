const _ = require("lodash");
const moment = require("moment");

const { findPickupDate } = require("./helpers");
const { ofdCount } = require("../../utils");
const { NEW_STATUS_TO_OLD_MAPPING } = require("./constants");

/**
 *
 * @param {*} trackData
 * @returns
 */
const prepareTrackDictForV1 = (trackData) => {
  const scanType = trackData?.status?.current_status_type;
  const pickupTime = findPickupDate(trackData);
  const trackDict = {
    awb: trackData?.tracking_id,
    scan_type: scanType !== "PPF" ? NEW_STATUS_TO_OLD_MAPPING[scanType] || scanType : scanType,
    scan_datetime: trackData?.status?.current_status_time
      ? moment(trackData?.status?.current_status_time)
          .add(330, "minutes")
          .format("DD-MM-YYYY HH:mm")
      : null,
    track_info: trackData?.status?.current_status_body,
    track_location: trackData?.status?.current_status_location,
    received_by: trackData?.status?.received_by,
    pickup_time: pickupTime
      ? moment(pickupTime).add(330, "minutes").format("DD-MM-YYYY HH:mm")
      : null,
    EDD: trackData?.edd_stamp
      ? moment(trackData?.edd_stamp).add(330, "minutes").format("DD-MM-YYYY HH:mm")
      : null,
    promise_edd: trackData?.promise_edd
      ? moment(trackData?.promise_edd).add(330, "minutes").format("DD-MM-YYYY HH:mm")
      : null,
    pickrr_status: NEW_STATUS_TO_OLD_MAPPING[scanType] || scanType,
    pickrr_sub_status_code:
      trackData?.pickrr_sub_status_code ||
      _.get(trackData, "track_arr[0].pickrr_sub_status_code", ""),
    courier_status_code: _.get(trackData, "track_arr[0].courier_status_code", ""),
    ofd_count: trackData?.track_arr ? ofdCount(trackData?.track_arr || []) : 0,
    source: "node-kafka",
  };
  return trackDict;
};

module.exports = {
  prepareTrackDictForV1,
};

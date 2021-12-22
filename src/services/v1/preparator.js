const _ = require("lodash");
const moment = require("moment");

const { findPickupDate } = require("./helpers");
const { ofdCount } = require("./helpers");
const { NEW_STATUS_TO_OLD_MAPPING } = require("./constants");

/**
 *
 * @param {*} trackData
 * @returns
 */
const prepareTrackDictForV1 = (trackData) => {
  const scanType = trackData?.status?.current_status_type;

  const trackDict = {
    awb: trackData?.tracking_id,
    scan_type: NEW_STATUS_TO_OLD_MAPPING[scanType] || scanType,
    scan_datetime: trackData?.status?.current_status_time
      ? moment(trackData?.status?.current_status_time).format("DD-MM-YYYY HH:mm")
      : "",
    track_info: trackData?.status?.current_status_body,
    track_location: trackData?.status?.current_status_location,
    received_by: trackData?.status?.received_by,
    pickup_datetime: findPickupDate(trackData?.track_arr || []),
    EDD: trackData?.edd_stamp,
    pickrr_status: NEW_STATUS_TO_OLD_MAPPING[scanType],
    pickrr_sub_status_code:
      trackData?.pickrr_sub_status_code ||
      _.get(trackData, "track_arr[0].pickrr_sub_status_code", ""),
    courier_status_code: _.get(trackData, "track_arr[0].courier_status_code", ""),
    ofd_count: ofdCount(trackData?.track_arr),
  };
  return trackDict;
};

module.exports = {
  prepareTrackDictForV1,
};

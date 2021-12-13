const _ = require("lodash");
const { findPickupDate } = require("./helpers");
const { ofdCount } = require("./helpers");

/**
 *
 * @param {*} trackData
 * @returns
 */
const prepareTrackDictForV1 = (trackData) => {
  const trackDict = {
    awb: trackData?.tracking_id,
    scan_type: trackData?.status?.current_status_type,
    scan_datetime: trackData?.curren,
    track_info: trackData?.status?.current_status_body,
    track_location: trackData?.status?.current_status_body,
    received_by: trackData?.status?.received_by,
    pickup_datetime: findPickupDate(trackData?.track_arr),
    EDD: trackData?.edd_stamp,
    pickrr_status: trackData?.status?.current_status_type,
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

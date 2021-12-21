const _ = require("lodash");
const { ofdCount, convertDatetimeFormat, findPickupDate } = require("./helpers");
const { NEW_STATUS_TO_OLD_MAPPING } = require("./constants");

/**
 *
 * @param {*} trackData
 * @returns
 */
const prepareTrackDictForV1 = (trackData) => {
  const scanType = trackData?.status?.current_status_type;

  const trackDict = {
    awb: trackData?.tracking_id || "",
    scan_type: NEW_STATUS_TO_OLD_MAPPING[scanType] || "",
    scan_datetime: convertDatetimeFormat(trackData?.status?.current_status_time),
    track_info: trackData?.status?.current_status_body || "",
    track_location: trackData?.status?.current_status_location || "",
    received_by: trackData?.status?.received_by || "",
    pickup_time: convertDatetimeFormat(findPickupDate(trackData?.track_arr)),
    EDD: convertDatetimeFormat(trackData?.edd_stamp),
    pickrr_status: NEW_STATUS_TO_OLD_MAPPING[scanType] || "",
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

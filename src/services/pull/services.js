const _ = require("lodash");
const moment = require("moment");
const { checkAwbInCache } = require("../../utils/helpers");
const { BLOCK_NDR_STRINGS } = require("./constants");
const { mapStatusToEvent } = require("./helpers");

/** *
 * @param preparedTrackData -> [
 * {
    awb: '75456956632',
    scan_type: 'PPF',
    scan_datetime: '17-06-2019 18:06',
    track_info: 'PICKUP CANCELLED; QUALITY CHECK FAILED',
    track_location: 'MANALI SERVICE CENTRE',
    received_by: '',
    pickup_datetime: '17-06-2019 08:00',
    EDD: '30-12-2021',
    pickrr_status: 'Pickup Failed',
    pickrr_sub_status_code: 'REJ',
    courier_status_code: '016-S'
  }
 * ] 
  * @desc check in cache and if exists then return false otherwise return tracking object, which will be move forward
 * @returns {string}
 */
const redisCheckAndReturnTrackData = async (preparedTrackData) => {
  const trackObj = preparedTrackData[0];
  const isExists = await checkAwbInCache(trackObj);
  if (isExists) {
    return false;
  }
  return trackObj;
};

/**
 *
 * preparing track data
 */
const prepareTrackDataToUpdateInPullDb = (trackObj) => {
  const trackData = _.cloneDeep(trackObj);
  const {
    scan_type: scanType = "",
    track_info: trackInfo = "",
    scan_datetime: scanDatetime = "",
    track_location: trackLocation = "",
    EDD: edd = "",
  } = trackData;

  if (scanType === "CC") {
    return {
      success: false,
      err: "scanType is CC",
    };
  }

  if (trackInfo.toLowerCase() in BLOCK_NDR_STRINGS && scanType === "NDR") {
    trackData.scan_type = "OT";
  }
  let currentStatusTime = moment(scanDatetime, "DD-MM-YYYY HH:MM");
  currentStatusTime = currentStatusTime.isValid() ? currentStatusTime.format() : null;

  const statusMap = {
    current_status_time: currentStatusTime,
    current_status_type: scanType,
    current_status_body: trackInfo,
    current_status_location: trackLocation,
  };

  const eventObj = mapStatusToEvent(statusMap);
  eventObj.pickrr_sub_status_code = trackData.pickrr_sub_status_code;
  eventObj.courier_status_code = trackData.courier_status_code;
  eventObj.update_source = "kafka";
  eventObj.update_time = moment().utc().format();

  const eddDate = moment(edd, "DD-MM-YYYY");
  const eddStamp = eddDate.isValid() ? eddDate.format("DD-MM-YYYY HH:MM") : edd;

  return {
    success: true,
    eddStamp,
    eventObj,
    statusMap,
  };
};

module.exports = {
  redisCheckAndReturnTrackData,
  prepareTrackDataToUpdateInPullDb,
};

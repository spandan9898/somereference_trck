const { checkAwbInCache } = require("../../utils/redis");

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

module.exports = {
  redisCheckAndReturnTrackData,
};

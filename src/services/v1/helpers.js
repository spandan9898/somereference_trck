const { checkIsAfter, findLastPrePickupTime } = require("../pull/helpers");
const { PP_PROXY_LIST } = require("./constants");

/**
 *
 * @param {*} trackData
 */
const findPickupDate = (trackData) => {
  if (trackData?.pickup_datetime) {
    return trackData?.pickup_datetime;
  }

  let pickupDatetime = "";
  const trackArr = trackData?.track_arr || [];
  const lastPrePickupTime = findLastPrePickupTime(trackArr);
  for (let i = 0; i < trackArr.length; i += 1) {
    const isAfter = checkIsAfter(trackArr[i]?.scan_datetime, lastPrePickupTime);
    if (PP_PROXY_LIST.includes(trackArr[i]?.scan_type) && isAfter) {
      pickupDatetime = trackArr[i]?.scan_datetime;
    }
  }
  return pickupDatetime;
};
module.exports = {
  findPickupDate,
};

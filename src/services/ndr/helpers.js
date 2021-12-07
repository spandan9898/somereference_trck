/**
 *
 * @param {*} track_arr
 */
const findPickupDate = (trackArr) => {
  // eslint-disable-next-line consistent-return
  trackArr.forEach((trackArrObj) => {
    if (trackArrObj?.scan_type === "PP") {
      return trackArrObj.scan_datetime;
    }
  });
  return "";
};

/**
 *
 * @param {*} track_arr
 */
const ofdCount = (trackArr) => {
  // eslint-disable-next-line consistent-return
  let ofdCountNum = 0;
  trackArr.forEach((trackArrObj) => {
    if (trackArrObj?.scan_type === "OO") {
      ofdCountNum += 1;
    }
  });
  return ofdCountNum;
};
module.exports = {
  findPickupDate,
  ofdCount,
};

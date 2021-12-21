const moment = require("moment");

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

/**
 *
 * @param {*} track_arr
 */
const findPickupDate = (trackArr) => {
  for (let i = 0; i < trackArr.length; i += 1) {
    if (trackArr[i].scan_type === "PP") {
      return trackArr[i].scan_datetime;
    }
  }
  return "";
};

/**
 *
 * @param {*} dateObject
 * @returns
 */
const convertDatetimeFormat = (dateObject) => {
  if (!dateObject) {
    return "";
  }
  return moment(dateObject).format("DD-MM-YYYY HH:mm");
};

module.exports = {
  ofdCount,
  findPickupDate,
  convertDatetimeFormat,
};

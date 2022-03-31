/**
 *
 * @param {*} track_arr
 */
const findPickupDate = (trackArr) => {
  for (let i = 0; i < trackArr.length; i += 1) {
    if (trackArr[i].scan_type === "PP") {
      return trackArr[i]?.scan_datetime;
    }
  }
  return "";
};
module.exports = {
  findPickupDate,
};

const { PP_PROXY_LIST } = require("./constants");

/**
 *
 * @param {*} trackData
 */
const findPickupDate = (trackData, updateObj) => {
  if (!trackData.pickup_datetime || updateObj?.status?.current_status_type === "PP") {
    if (PP_PROXY_LIST.includes(updateObj?.status?.current_status_type)) {
      return updateObj?.status?.current_status_time;
    }
  }
  return "";
};
module.exports = {
  findPickupDate,
};

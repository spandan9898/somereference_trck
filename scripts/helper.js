const moment = require("moment");

/**
 *
 * @param {string} date
 * @desc date format must be DD-MM-YYYY
 */
const convertDate = (date, type) => {
  const setObj =
    type === "start"
      ? { hour: 18, minute: 30, second: 0 }
      : { hour: 18, minute: 29, second: 59, millisecond: 999 };
  return moment(date, "DD-MM-YYYY").set(setObj).toDate();
};

module.exports = {
  convertDate,
};

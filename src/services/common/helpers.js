const { orderBy } = require("lodash");

/**
 * sorring status array desc -> The last scan time will be in the top
 */
const sortStatusArray = (statusArray) =>
  orderBy(statusArray, (obj) => new Date(obj.scan_datetime), ["desc"]);

module.exports = {
  sortStatusArray,
};

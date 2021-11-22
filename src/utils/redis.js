const redis = require("redis");
const moment = require("moment");

const redisClient = redis.createClient();

redisClient.on("error", (error) => {
  console.error(error.message);

  // TODO: notify us
});

redisClient.on("connect", () => {
  console.log("Redis Connected!");
});

/** *
 * retrieve string value from redis-cache
 * @param {string} key
 * @returns {string}
 */
const getString = (key) =>
  new Promise((resolve, reject) => {
    redisClient.get(key, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(resValue);
    });
  });

/** *
 * insert string value to redis-cache
 * @param {string} key
 * @param {string} value
 * @returns {string} "OK"
 */
const setString = (key, value) =>
  new Promise((resolve, reject) => {
    redisClient.set(key, value, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(resValue);
    });
  });

/** *
 * retrieve object value from redis-cache
 * @param {string} key
 * @returns {object}
 */
const getObject = (key) =>
  new Promise((resolve, reject) => {
    redisClient.get(key, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(resValue));
    });
  });

/** *
 * insert object value to redis-cache
 * @param {string} key
 * @param {object} value
 * @returns {string} "OK"
 */
const setObject = (key, value) =>
  new Promise((resolve, reject) => {
    let newValue = value;
    if (typeof value === "object") {
      newValue = JSON.stringify(value);
    }

    redisClient.set(key, newValue, (err, resValue) => {
      if (err) {
        reject(err);
      }
      console.log("resValue");
      resolve(resValue);
    });
  });

/** *
 * @param {string} key
 * @returns {Number} 1
 */
const deleteKey = (key) =>
  new Promise((resolve, reject) => {
    redisClient.del(key, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(resValue);
    });
  });

/**
 *
 * @param {*} trackObj
 * @desc Check awb in cache with below conditions
 * Check if awb not in redis then go forward -> return false i.e move forward
 * if exists then check ->
 *      NST < OST -> return true,  i.e data exists , stop process here
 *      NST - OST < 1 minute and type is same -> return false, i.e same as above
 * Otherwise -> return false i.e move foward
 * @returns true or false
 */
const checkAwbInCache = async (trackObj) => {
  const getCacheData = await getObject(trackObj.awb);

  if (!getCacheData) {
    return false;
  }

  const oldScanDateTime = moment(getCacheData.scan_datetime, "DD-MM-YYYY HH:MM");
  const newScanDateTime = moment(trackObj.scan_datetime, "DD-MM-YYYY HH:MM");
  const oldScanType = getCacheData.scan_type;
  const newScanType = trackObj.scan_type;

  if (newScanDateTime.isBefore(newScanDateTime)) {
    return true;
  }

  const diff = newScanDateTime.diff(oldScanDateTime, "minute");
  if (diff < 1 && oldScanType === newScanType) {
    return true;
  }
  return false;
};

module.exports = {
  getString,
  setString,
  getObject,
  setObject,
  deleteKey,
  checkAwbInCache,
  redisClient,
};

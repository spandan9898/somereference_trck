const { createClient } = require("redis");
const logger = require("../../logger");

const redisClient = createClient();

redisClient.on("error", (error) => {
  logger.error("Redis Connection Error", error);
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
 * ES6 redis cache store with expired keys
 * expiryTime in seconds
 */
const storeInCache = async (key, value, expiryTime) => {
  try {
    const redisKey = typeof key === "string" ? key : JSON.stringify(key);
    const redisValue = typeof value === "string" ? value : JSON.stringify(value);
    const redisExpiryTime = expiryTime || 7 * 24 * 60 * 60;
    await redisClient.set(redisKey, redisValue, {
      EX: redisExpiryTime,
    });
  } catch (error) {
    logger.error("storeInCache", error);
  }
};

module.exports = {
  getString,
  setString,
  getObject,
  setObject,
  deleteKey,
  redisClient,
  storeInCache,
};

const Redis = require("ioredis");
const logger = require("../../logger");

const { REDIS_CONFIG } = require("./constants");

let redisConf = null;

if (process.env.NODE_ENV === "production") {
  redisConf = REDIS_CONFIG;
}

const redisClient = new Redis(redisConf);

redisClient.on("error", (error) => {
  logger.error("Redis Connection Error", error);
});

/** *
 * retrieve string value from redis-cache
 * @param {string} key
 * @returns {string}
 */
const getString = async (key) => {
  const res = await redisClient.get(key);
  return res;
};

/** *
 * insert string value to redis-cache
 * @param {string} key
 * @param {string} value
 * @returns {string} "OK"
 */
const setString = async (key, value) => {
  await redisClient.set(key, value);
};

/** *
 * retrieve object value from redis-cache
 * @param {string} key
 * @returns {object}
 */
const getObject = async (key) => {
  const res = await redisClient.get(key);
  return JSON.parse(res);
};

/** *
 * insert object value to redis-cache
 * @param {string} key
 * @param {object} value
 * @returns {string} "OK"
 */
const setObject = async (key, value) => {
  const payloadValue = JSON.stringify(value);
  await redisClient.set(key, payloadValue);
};

/** *
 * @param {string} key
 * @returns {Number} 1
 */
const deleteKey = async (key) => {
  await redisClient.del(key);
};

/**
 * redis cache store with expired keys
 * expiryTime in seconds
 */
const storeInCache = async (key, value, expiryTime) => {
  try {
    const redisKey = typeof key === "string" ? key : JSON.stringify(key);
    const redisValue = typeof value === "string" ? value : JSON.stringify(value);
    const redisExpiryTime = expiryTime || 1 * 24 * 60 * 60;
    await redisClient.set(redisKey, redisValue, "EX", redisExpiryTime);
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

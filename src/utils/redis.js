const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("error", (error) => {
  console.error(error);
  throw error;
});

redisClient.on("connect", () => {
  console.log("Connected!");
});

/** *
 * retrieve string value from redis-cache
 * @param {string} key
 * @returns {string}
 */

function getString(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(resValue);
    });
  });
}

/** *
 * insert string value to redis-cache
 * @param {string} key
 * @param {string} value
 * @returns {string} "OK"
 */

function setString(key, value) {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(resValue);
    });
  });
}

/** *
 * retrieve object value from redis-cache
 * @param {string} key
 * @returns {object}
 */

function getObject(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(resValue));
    });
  });
}

/** *
 * insert object value to redis-cache
 * @param {string} key
 * @param {object} value
 * @returns {string} "OK"
 */

function setObject(key, value) {
  return new Promise((resolve, reject) => {
    let newKey = key;
    if (typeof value === "object") {
      newKey = JSON.stringify(value);
    }

    redisClient.set(newKey, value, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(resValue);
    });
  });
}

/** *
 * @param {string} key
 * @returns {Number} 1
 */

function deleteKey(key) {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, resValue) => {
      if (err) {
        reject(err);
      }
      resolve(resValue);
    });
  });
}

module.exports = {
  getString,
  setString,
  getObject,
  setObject,
  deleteKey,
};

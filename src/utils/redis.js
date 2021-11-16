
const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on("error", function(error) {
    console.error(error);
    throw error;
  });

redisClient.on('connect', function() {
    console.log('Connected!');
  });

/***
 * retrieve string value from redis-cache
 * @param {string} key
 * @returns {string}
 */
function getString(key) {
    return new Promise((resolve,reject) => {
        redisClient.get(key, function(err,value){
            if (err){
                reject(err);
            }
            resolve(value);
        })
    })
}

/***
 * insert string value to redis-cache
 * @param {string} key
 * @param {string} value
 * @returns {string} "OK"
 */
function setString(key,value){
    return new Promise((resolve,reject)=>{
        redisClient.set(key,value,function(err,value){
            if (err){
                reject(err);
            }
            resolve(value);
        })
    })
}

/***
 * retrieve object value from redis-cache
 * @param {string} key
 * @returns {object}
 */
function getObject(key){
    return new Promise((resolve,reject) => {
        redisClient.get(key, function(err,value){
            if (err){
                reject(err);
            }
            resolve(JSON.parse(value));
        })
    })
}

/***
 * insert object value to redis-cache
 * @param {string} key
 * @param {object} value
 * @returns {string} "OK"
 */
function setObject(key,value){
    return new Promise((resolve,reject)=>{
        if (typeof(key)==='object'){
            key = JSON.stringify(key);
        }

        redisClient.set(key,value,function(err,value){
            if (err){
                reject(err);
            }
            resolve(value);
        })
    })
}

module.exports = {
    getString,
    setString,
    getObject,
    setObject,
}
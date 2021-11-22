/* eslint-disable consistent-return */
const { MongoClient } = require("mongodb");

let db;

/**
 *
 * @desc Pull Database Connection
 */
const initDB = (callback) => {
  // If DB already connected and Initialized

  if (db) {
    console.log(`${db.getName()} DB has already initialized`);
    return callback(null, db);
  }

  MongoClient.connect(process.env.MONGO_DB_PULL_SERVER_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((client) => {
      db = client;
      callback(null, db);
    })
    .catch((err) => {
      callback(err);
    });
};

/**
 *
 * @desc exposing get db instance
 */
const getDB = () => {
  if (!db) {
    throw Error("DB not initialized");
  }
  return db;
};

module.exports = {
  initDB,
  getDB,
};

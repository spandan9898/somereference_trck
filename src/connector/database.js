/* eslint-disable consistent-return */
const { MongoClient, ServerApiVersion } = require("mongodb");
const logger = require("../../logger");

// DB

let db;

/**
 * Init Pull DB
 */
const initDB = (callback) => {
  // If DB already connected and Initialized

  if (db) {
    logger.info("DB has already initialized");
    return callback(null, db);
  }
  console.log("-------");
  console.log("the name is ", process.env.MONGO_DB_PROD_SERVER_HOST);
  console.log("-------");

  MongoClient.connect(
    "mongodb+srv://dev:DGcIhTUYJIeVNvm3@cluster0.z3kfm.mongodb.net/kafka_test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    }
  )
    .then((client) => {
      db = client;
      callback(null, db);
    })
    .catch((err) => {
      callback(err);
    });
};

/**
 * Get DB Instance
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

const logger = require("../../../logger");
const db = require("../../connector/database");

/**
 *
 * @returns
 */
const reportMongoCol = async () => {
  try {
    const res = db
      .getDB()
      .db(process.env.MONGO_DB_REPORT_SERVER_HOST)
      .collection(process.env.MONGO_DB_SERVER_COLLECTION_NAME);
    return res;
  } catch (error) {
    logger.error("reportMongoCol connection error", error);
    throw new Error(error);
  }
};

module.exports = reportMongoCol;

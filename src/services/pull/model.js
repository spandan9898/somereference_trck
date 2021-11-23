const db = require("../../connector/database");

/**
 * @desc Get commonTrackingInfo collection instance
 */
const commonTrackingInfoCol = async () => {
  try {
    const res = db.getDB().db().collection(process.env.MONGO_DB_PULL_SERVER_COLLECTION_NAME);
    return res;
  } catch (error) {
    console.error(`Error encountered ${error}`);
    throw new Error(error);
  }
};

module.exports = commonTrackingInfoCol;

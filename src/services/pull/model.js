const { pullDbMongoClient } = require("../../connector/database");

/**
 * @desc Get commonTrackingInfo collection instance
 */
const commonTrackingInfoCol = async () => {
  try {
    await pullDbMongoClient.connect();
    const db = pullDbMongoClient.db(process.env.MONGO_DB_PULL_SERVER_DATABASE_NAME);
    const pullCollection = db.collection(process.env.MONGO_DB_PULL_SERVER_COLLECTION_NAME);
    return await pullCollection;
  } catch (error) {
    console.error(`Error encountered ${error}`);
    throw new Error(error);
  }
};

module.exports = commonTrackingInfoCol;

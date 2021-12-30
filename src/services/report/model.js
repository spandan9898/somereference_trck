const logger = require("../../../logger");
const { getDbCollectionInstance } = require("../../utils");

const { HOST_NAMES } = require("../../utils/constants");

const { MONGO_DB_REPORT_DB_NAME, MONGO_DB_REPORT_COLLECTION_NAME } = process.env;

/**
 * @desc Get reportMongo collection instance (kafka_staging)
 */
const reportMongoCol = async () => {
  try {
    const opsReportColInstance = await getDbCollectionInstance({
      dbName: MONGO_DB_REPORT_DB_NAME,
      collectionName: MONGO_DB_REPORT_COLLECTION_NAME,
      hostName: HOST_NAMES.REPORT_DB,
    });
    return opsReportColInstance;
  } catch (error) {
    logger.error("reportMongoConnection Error ", error);
    throw new Error(error);
  }
};

module.exports = { reportMongoCol };

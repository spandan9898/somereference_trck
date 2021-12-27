const logger = require("../../../logger");
const { initReportDB } = require("../../connector/reportdatabase");

/**
 * @desc Get reportMongo collection instance (kafka_staging)
 */
const reportMongoCol = async () => {
  const reportClient = await initReportDB();
  try {
    const reportDb = reportClient.db(process.env.MONGO_DB_REPORT_DB_NAME);
    const opsReportColInstance = await reportDb.collection("opsreport_col");
    return {
      reportClient,
      opsReportColInstance,
    };
  } catch (error) {
    logger.error("reportMongoConnection Error ", error);
    throw new Error(error);
  }
};

module.exports = { reportMongoCol };

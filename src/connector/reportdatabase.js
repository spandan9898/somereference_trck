const { MongoClient, ServerApiVersion } = require("mongodb");
const logger = require("../../logger");

let reportDb;

/**
 *
 */
const initReportDB = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_DB_REPORT_SERVER_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    logger.info("Report DB connection established");

    return client;
  } catch (error) {
    logger.error("initReportDB", error);
    return "";
  }
};

module.exports = {
  initReportDB,
  reportDb,
};

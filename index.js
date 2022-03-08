/* eslint-disable global-require */
require("dotenv").config();

const server = require("./server");

const logger = require("./logger");
const { redisClient } = require("./src/utils");
const initDB = require("./src/connector/db");
const initELK = require("./src/connector/elkConnection");

const { HOST_NAMES, ELK_INSTANCE_NAMES } = require("./src/utils/constants");

const {
  MONGO_DB_PROD_SERVER_HOST,
  MONGO_DB_REPORT_SERVER_HOST,
  MONGO_PULLL_DB_STAGING_SERVER_HOST,
} = process.env;

(async () => {
  try {
    await redisClient.connect();
    logger.info("Redis Connected");
  } catch (error) {
    logger.error("Redis connect error", error);
    process.exit(1);
  }
})();

(async () => {
  try {
    await initDB.connectDb(HOST_NAMES.PULL_DB, MONGO_DB_PROD_SERVER_HOST);
    await initDB.connectDb(HOST_NAMES.REPORT_DB, MONGO_DB_REPORT_SERVER_HOST);
    await initDB.connectDb(HOST_NAMES.PULL_STATING_DB, MONGO_PULLL_DB_STAGING_SERVER_HOST);
    await initELK.connectELK(ELK_INSTANCE_NAMES.PROD.name, ELK_INSTANCE_NAMES.PROD.config);
    await initELK.connectELK(ELK_INSTANCE_NAMES.STAGING.name, ELK_INSTANCE_NAMES.STAGING.config);

    require("./src/apps/bluedart");
    require("./src/apps/delhivery");
    require("./src/apps/amaze");
    require("./src/apps/xpressbees");
    require("./src/apps/ekart");
    require("./src/apps/udaan");
    require("./src/apps/ecomm");
    require("./src/apps/shadowfax");
    require("./src/apps/parceldo");
    require("./src/apps/pidge");
    require("./src/apps/dtdc");
    require("./src/apps/pickrrConnect");
  } catch (error) {
    logger.error("DB Connection Error", error);
  }
})();

server.createServer(logger);

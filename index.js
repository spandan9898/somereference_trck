/* eslint-disable global-require */
require("dotenv").config();

const server = require("./server");

const logger = require("./logger");
const { fileLogger } = require("./logger");

const initDB = require("./src/connector/db");
const initELK = require("./src/connector/elkConnection");
const kafka = require("./src/connector/kafka");

const { HOST_NAMES, ELK_INSTANCE_NAMES, KAFKA_INSTANCE_CONFIG } = require("./src/utils/constants");

const { MONGO_DB_PROD_SERVER_HOST, MONGO_DB_REPORT_SERVER_HOST, MONGO_DB_STAGING_SERVER_HOST } =
  process.env;

(async () => {
  try {
    await initDB.connectDb(HOST_NAMES.PULL_DB, MONGO_DB_PROD_SERVER_HOST);
    await initDB.connectDb(HOST_NAMES.REPORT_DB, MONGO_DB_REPORT_SERVER_HOST);
    if (process.env.NODE_ENV === "staging") {
      await initDB.connectDb(HOST_NAMES.PULL_STATING_DB, MONGO_DB_STAGING_SERVER_HOST);
    }

    await initELK.connectELK(ELK_INSTANCE_NAMES.PROD.name, ELK_INSTANCE_NAMES.PROD.config);

    // await initELK.connectELK(ELK_INSTANCE_NAMES.STAGING.name, ELK_INSTANCE_NAMES.STAGING.config);

    await initELK.connectELK(ELK_INSTANCE_NAMES.TRACKING.name, ELK_INSTANCE_NAMES.TRACKING.config);

    await kafka.connect(KAFKA_INSTANCE_CONFIG.PROD.name, KAFKA_INSTANCE_CONFIG.PROD.config);

    if (process.env.IS_CONSUME_ALL === "false") {
      require("./src/apps/autosync");
      return false;
    }

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
    require("./src/apps/smartr");
    require("./src/apps/loadshare");
    require("./src/apps/pickrrConnect");
    require("./src/apps/pikndel");

    return true;
  } catch (error) {
    logger.error("DB Connection Error", error);
    return false;
  }
})();

server.createServer(logger);

process.on("unhandledRejection", (error) => {
  fileLogger.error("unhandledRejection", error);
});

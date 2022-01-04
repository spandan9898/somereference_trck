/* eslint-disable global-require */
require("dotenv").config();

const server = require("./server");

const logger = require("./logger");
const { redisClient } = require("./src/utils");
const initDB = require("./src/connector/db");

const { HOST_NAMES } = require("./src/utils/constants");
const WebhookClient = require("./src/apps/webhookClients");
const { trackinObj } = require("./mockData");

const { MONGO_DB_PROD_SERVER_HOST, MONGO_DB_REPORT_SERVER_HOST } = process.env;

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
    const webhookClient = new WebhookClient(trackinObj);
    const res = await webhookClient.getPreparedData();
    console.log("res", res);

    // require("./src/apps/bluedart");
    // require("./src/apps/delhivery");
    // require("./src/apps/amaze");
    // require("./src/apps/xpressbees");
    // require("./src/apps/ekart");
    // require("./src/apps/udaan");
    // require("./src/apps/ecomm");
    // require("./src/apps/shadowfax");
    // require("./src/apps/parceldo");
  } catch (error) {
    logger.error("DB Connection Error", error);
  }
})();

server.createServer(logger);

require("dotenv").config();
const fs = require("fs");

const chunk = require("lodash/chunk");
const logger = require("../logger");

const initDB = require("../src/connector/db");
const initELK = require("../src/connector/elkConnection");
const updateStatusOnReport = require("../src/services/report");
const sendTrackDataToV1 = require("../src/services/v1");
const { getDbCollectionInstance } = require("../src/utils");
const { HOST_NAMES, ELK_INSTANCE_NAMES } = require("../src/utils/constants");

const { MONGO_DB_PROD_SERVER_HOST, MONGO_DB_REPORT_SERVER_HOST } = process.env;

/**
 *
 * @param {*} records
 */
const processBackfilling = async (data, collection, elkClient) => {
  const courierTrackingIds = data.map((awb) => `${awb}`);
  const responses = await collection
    .find({ tracking_id: { $in: courierTrackingIds } })
    .project({ audit: 0, mandatory_status_map: 0, _id: 0 })
    .toArray();

  responses.forEach((response) => {
    // updateStatusOnReport(response, logger, elkClient);

    sendTrackDataToV1(response);
    console.log("Done -->", response.tracking_id);
  });
};

/**
 *
 * @desc get count from terminal
 */
const getCount = () => {
  let count = process.argv.slice(2);
  if (!count.length) {
    return 0;
  }
  count = +count[0];
  return count;
};

/** */
const main = async () => {
  try {
    const count = getCount();

    const filePath = `${__dirname}/report.json`;
    const isExists = fs.existsSync(filePath);
    if (!isExists) {
      logger.warn(`File does not exist: ${filePath}`);
    }

    let records = fs.readFileSync(filePath, "utf8");
    records = JSON.parse(records);

    if (count) {
      records = records.slice(0, count);
    }

    await initDB.connectDb(HOST_NAMES.PULL_DB, MONGO_DB_PROD_SERVER_HOST);
    await initDB.connectDb(HOST_NAMES.REPORT_DB, MONGO_DB_REPORT_SERVER_HOST);
    await initELK.connectELK(ELK_INSTANCE_NAMES.PROD.name, ELK_INSTANCE_NAMES.PROD.config);
    await initELK.connectELK(ELK_INSTANCE_NAMES.STAGING.name, ELK_INSTANCE_NAMES.STAGING.config);

    const collection = await getDbCollectionInstance();

    const elkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.PROD.name);
    const chunkedData = chunk(records, 1000);
    chunkedData.forEach((data) => {
      processBackfilling(data, collection, elkClient);
    });

    console.log("Process Completed");
  } catch (error) {
    console.log("Main ERROR", error);
  }
};

main();

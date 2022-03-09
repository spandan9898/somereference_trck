/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable require-jsdoc */

require("dotenv").config();
const fs = require("fs");
const Papa = require("papaparse");

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
const main = async (records, collection, elkClient) => {
  try {
    const chunkedData = chunk(records, 1000);

    chunkedData.forEach((data) => {
      processBackfilling(data, collection, elkClient);
    });
  } catch (error) {
    console.log("Main ERROR", error);
  }
};

/**
 * read data from csv file
 */
const readCsvData = (cb, collection, elkClient) => {
  const allData = [];
  try {
    const filePath = `${__dirname}/data.csv`;
    const isExists = fs.existsSync(filePath);
    if (!isExists) {
      logger.warn(`File does not exist: ${filePath}`);
    }

    fs.writeFileSync(`${__dirname}/report.json`, JSON.stringify([]), "utf8");

    const file = fs.createReadStream(filePath);
    Papa.parse(file, {
      worker: true,
      step(results) {
        allData.push(results.data[0]);
      },
      complete() {
        fs.writeFileSync(`${__dirname}/report.json`, JSON.stringify(allData), "utf8");
        cb(collection, elkClient);
      },
    });
  } catch (error) {
    logger.error("v1BackFilling", error);
  }
};

/**
 * @desc process 2k batch  data
 */
const getBatchData = async (collection, elkClient) => {
  try {
    const filePath = `${__dirname}/report.json`;
    const isExists = fs.existsSync(filePath);
    if (!isExists) {
      logger.warn(`File does not exist: ${filePath}`);
    }

    let records = fs.readFileSync(filePath, "utf8");
    if (!records) {
      logger.warn("Data not found in report.json");
      return false;
    }
    records = JSON.parse(records);

    const count = getCount();

    if (count) {
      records = records.slice(0, count);
    }

    console.log("Total Data -->", records.length);

    const chunkedData = chunk(records, 2000);

    for (const chunkData of chunkedData) {
      await main(chunkData, collection, elkClient);
      await new Promise((done) => setTimeout(() => done(), 15000));
    }
    logger.info("==== Process Completed ====");
    return true;
  } catch (error) {
    logger.error("getBatchData error", error);
    return false;
  }
};

const startProcess = async () => {
  await initDB.connectDb(HOST_NAMES.PULL_DB, MONGO_DB_PROD_SERVER_HOST);
  await initDB.connectDb(HOST_NAMES.REPORT_DB, MONGO_DB_REPORT_SERVER_HOST);
  await initELK.connectELK(ELK_INSTANCE_NAMES.PROD.name, ELK_INSTANCE_NAMES.PROD.config);
  await initELK.connectELK(ELK_INSTANCE_NAMES.STAGING.name, ELK_INSTANCE_NAMES.STAGING.config);

  const collection = await getDbCollectionInstance();

  const elkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.PROD.name);
  readCsvData(getBatchData, collection, elkClient);
};

startProcess();

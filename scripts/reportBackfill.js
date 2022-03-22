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
const { convertDate } = require("./helper");

const { MONGO_DB_PROD_SERVER_HOST, MONGO_DB_REPORT_SERVER_HOST } = process.env;

/**
 *
 * @param {*} records
 */
const processBackfilling = async (data, collection, elkClient, type) => {
  const courierTrackingIds = data.map((awb) => `${awb}`);

  const responses = await collection
    .find({ tracking_id: { $in: courierTrackingIds } })
    .project({ audit: 0, mandatory_status_map: 0, _id: 0 })
    .toArray();

  responses.forEach((response) => {
    if (type === "v1") {
      sendTrackDataToV1(response);
    } else if (type === "report") {
      updateStatusOnReport(response, logger, elkClient);
    }
    console.log("Done -->", response.tracking_id);
  });
};

/** */
const main = async (records, collection, elkClient, type) => {
  try {
    const chunkedData = chunk(records, 1000);

    chunkedData.forEach((data) => {
      processBackfilling(data, collection, elkClient, type);
    });
  } catch (error) {
    console.log("Main ERROR", error);
  }
};

/**
 * read data from csv file
 */
const readCsvData = (cb, collection, elkClient, limit, type) => {
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
        cb(collection, elkClient, limit, type);
      },
    });
  } catch (error) {
    logger.error("v1BackFilling", error);
  }
};

/**
 * @desc process 2k batch  data
 */
const getBatchData = async (collection, elkClient, count, type) => {
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

    if (count) {
      records = records.slice(0, count);
    }

    console.log("Total Data -->", records.length);

    const chunkedData = chunk(records, 500);

    for (const chunkData of chunkedData) {
      await main(chunkData, collection, elkClient, type);
      await new Promise((done) => setTimeout(() => done(), 25000));
    }
    logger.info("==== Process Completed ====");
    return true;
  } catch (error) {
    logger.error("getBatchData error", error);
    return false;
  }
};

const fetchDataFromDB = async ({
  authToken,
  endDate,
  startDate,
  limit,
  collection,
  elkClient,
  type,
}) => {
  try {
    const filters = {};

    if (authToken) {
      filters.auth_token = authToken;
    }

    filters.order_created_at = {
      $gte: convertDate(startDate, "start"),
      $lte: convertDate(endDate),
    };
    const pipeline = [{ $match: filters }];
    if (limit) {
      pipeline.push({ $limit: limit });
    }

    pipeline.push({
      $project: { audit: 0, mandatory_status_map: 0, _id: 0 },
    });

    const aggCursor = await collection.aggregate(pipeline);

    const trackingData = [];
    for await (const doc of aggCursor) {
      trackingData.push(doc);
    }

    if (!trackingData.length) {
      return;
    }

    console.log("total", trackingData.length);

    const chunkedData = chunk(trackingData, 500);

    for (const chunkData of chunkedData) {
      for (const trackingItem of chunkData) {
        if (type === "report") {
          updateStatusOnReport(trackingItem, logger, elkClient);
        } else if (type === "v1") {
          sendTrackDataToV1(trackingItem);
        }

        // await new Promise((done) => setTimeout(() => done(), 25000));

        console.log("Done -->", trackingItem.tracking_id);
      }
      await new Promise((done) => setTimeout(() => done(), 25000));
    }
  } catch (error) {
    logger.error("fetchDataFromDB error", error);
  }
};

/** */
const startProcess = async ({ authToken, endDate, startDate, limit, type }) => {
  await initDB.connectDb(HOST_NAMES.PULL_DB, MONGO_DB_PROD_SERVER_HOST);
  await initDB.connectDb(HOST_NAMES.REPORT_DB, MONGO_DB_REPORT_SERVER_HOST);
  await initELK.connectELK(ELK_INSTANCE_NAMES.TRACKING.name, ELK_INSTANCE_NAMES.TRACKING.config);

  const collection = await getDbCollectionInstance();

  const elkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.TRACKING.name);
  if (!startDate || !endDate) {
    readCsvData(getBatchData, collection, elkClient, limit, type);
  } else {
    fetchDataFromDB({ authToken, endDate, startDate, limit, collection, elkClient, type });
  }
};

module.exports = startProcess;

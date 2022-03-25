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
const { updateStatusELK } = require("../src/services/common/services");

const { MONGO_DB_PROD_SERVER_HOST, MONGO_DB_REPORT_SERVER_HOST } = process.env;

/**
 *
 * @param {*} records
 */
const processBackfilling = async (data, collection, elkClient, type, prodElkClient) => {
  const courierTrackingIds = data.map((awb) => `${awb}`);

  const responses = await collection
    .find({ tracking_id: { $in: courierTrackingIds } })
    .project({ audit: 0, mandatory_status_map: 0, _id: 0 })
    .toArray();

  for (const response of responses) {
    if (type === "v1") {
      sendTrackDataToV1(response);
    } else if (type === "report") {
      updateStatusOnReport(response, logger, elkClient);
    } else if (type === "elk") {
      updateStatusELK(response, prodElkClient);
    }
    console.log("Done -->", response.tracking_id);
    await new Promise((done) => setTimeout(() => done(), 5));
  }
};

/** */
const main = async (records, collection, elkClient, type, prodElkClient) => {
  try {
    const chunkedData = chunk(records, 1000);

    for (const data of chunkedData) {
      processBackfilling(data, collection, elkClient, type, prodElkClient);
      await new Promise((done) => setTimeout(() => done(), 100));
    }
  } catch (error) {
    console.log("Main ERROR", error);
  }
};

/**
 * read data from csv file
 */
const readCsvData = (cb, collection, elkClient, limit, type, prodElkClient) => {
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
        cb(collection, elkClient, limit, type, prodElkClient);
      },
    });
  } catch (error) {
    logger.error("v1BackFilling", error);
  }
};

/**
 * @desc process 2k batch  data
 */
const getBatchData = async (collection, elkClient, count, type, prodElkClient) => {
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
      await main(chunkData, collection, elkClient, type, prodElkClient);
      await new Promise((done) => setTimeout(() => done(), 25000));
    }
    logger.info("==== Process Completed ====");
    return true;
  } catch (error) {
    logger.error("getBatchData error", error);
    return false;
  }
};

const processForDbData = async ({ batchData: trackingData, type, elkClient, prodElkClient }) => {
  try {
    if (!trackingData.length) {
      return;
    }

    const chunkedData = chunk(trackingData, 500);

    for (const chunkData of chunkedData) {
      for (const trackingItem of chunkData) {
        if (type === "report") {
          updateStatusOnReport(trackingItem, logger, elkClient);
        } else if (type === "v1") {
          sendTrackDataToV1(trackingItem);
        } else if (type === "elk") {
          updateStatusELK(trackingItem, prodElkClient);
        }

        await new Promise((done) => setTimeout(() => done(), 10));

        console.log("Done -->", trackingItem.tracking_id);
      }
      await new Promise((done) => setTimeout(() => done(), 25000));
    }
  } catch (error) {
    logger.error("processForData", error);
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
  prodElkClient,
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
    const pipeline = [
      {
        $sort: { _id: -1 },
      },
      { $match: filters },
    ];

    pipeline.push({
      $project: { audit: 0, mandatory_status_map: 0, _id: 0 },
    });

    if (limit && limit < 4999) {
      pipeline.push({ $limit: limit });
      const aggCursor = await collection.aggregate(pipeline);
      const batchData = [];

      for await (const doc of aggCursor) {
        batchData.push(doc);
      }
      logger.verbose(`batchData : ${batchData.length}`);
      await processForDbData({ batchData, elkClient, type, prodElkClient });
    } else {
      // do the batching

      let skip = 0;
      const LIMIT = 50000;
      let isDataAvailable = false;

      do {
        pipeline[3] = { $skip: skip };
        pipeline[4] = { $limit: LIMIT };

        const batchData = [];
        const aggCursor = await collection.aggregate(pipeline, { allowDiskUse: true });
        let isPresent = false;

        for await (const doc of aggCursor) {
          batchData.push(doc);
          isPresent = true;
        }

        logger.verbose(`batchData In Loop : ${batchData.length}`);

        await processForDbData({ batchData, elkClient, type, prodElkClient });
        await new Promise((done) => setTimeout(() => done(), 60000));
        skip += LIMIT;
        isDataAvailable = isPresent;
      } while (isDataAvailable);
    }
    logger.verbose("DONE");
  } catch (error) {
    logger.error("fetchDataFromDB error", error);
  }
};

/** */
const startProcess = async ({ authToken, endDate, startDate, limit, type }) => {
  await initDB.connectDb(HOST_NAMES.PULL_DB, MONGO_DB_PROD_SERVER_HOST);
  await initDB.connectDb(HOST_NAMES.REPORT_DB, MONGO_DB_REPORT_SERVER_HOST);
  await initELK.connectELK(ELK_INSTANCE_NAMES.TRACKING.name, ELK_INSTANCE_NAMES.TRACKING.config);
  await initELK.connectELK(ELK_INSTANCE_NAMES.PROD.name, ELK_INSTANCE_NAMES.PROD.config);

  const collection = await getDbCollectionInstance();

  const elkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.TRACKING.name);
  const prodElkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.PROD.name);

  if (!startDate || !endDate) {
    readCsvData(getBatchData, collection, elkClient, limit, type, prodElkClient);
  } else {
    fetchDataFromDB({
      authToken,
      endDate,
      startDate,
      limit,
      collection,
      elkClient,
      type,
      prodElkClient,
    });
  }
};

module.exports = startProcess;

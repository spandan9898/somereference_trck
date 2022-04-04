/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable require-jsdoc */

require("dotenv").config();
const fs = require("fs");
const Papa = require("papaparse");
const { ObjectId } = require("mongodb");

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

// const sendDataToNdr = require("../src/services/ndr");

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
    if (type.includes("v1")) {
      sendTrackDataToV1(response);
    }
    if (type.includes("report")) {
      updateStatusOnReport(response, logger, elkClient);
    }
    if (type.includes("elk")) {
      updateStatusELK(response, prodElkClient);
    }

    // if (type.includes("ndr")) {
    //   sendDataToNdr(response);
    // }

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
        if (type.includes("v1")) {
          sendTrackDataToV1(trackingItem);
        }
        if (type.includes("report")) {
          updateStatusOnReport(trackingItem, logger, elkClient);
        }
        if (type.includes("elk")) {
          updateStatusELK(trackingItem, prodElkClient);
        }

        // if (type.includes("ndr")) {
        //   sendDataToNdr(trackingItem);
        // }

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
    const filters = {
      $and: [],
    };

    if (authToken) {
      filters.$and.push({
        auth_token: authToken,
      });
    }

    filters.$and.push({
      updated_at: {
        $gt: convertDate(startDate, "start"),
        $lt: convertDate(endDate),
      },
    });

    const projection = { audit: 0, mandatory_status_map: 0 };

    const filtersLength = filters.$and.length;
    if (limit && limit < 4999) {
      const batchData = [];

      const aggCursor = await collection.find(filters, projection).limit(limit);

      for await (const doc of aggCursor) {
        batchData.push(doc);
      }
      logger.verbose(`batchData ${limit}: ${batchData.length}`);

      await processForDbData({ batchData, elkClient, type, prodElkClient });
    } else {
      // do the batching

      const LIMIT = 50000;
      let isDataAvailable = false;
      let lastId;

      do {
        if (lastId) {
          filters.$and[filtersLength] = {
            _id: {
              $gt: ObjectId(lastId),
            },
          };
        }

        let isPresent = false;

        const batchData = [];

        const aggCursor = await collection.find(filters, projection).limit(LIMIT);

        for await (const doc of aggCursor) {
          batchData.push(doc);
          lastId = doc._id;
          isPresent = true;
        }

        logger.verbose(`batchData In Loop : ${batchData.length}`);

        await processForDbData({ batchData, elkClient, type, prodElkClient });

        await new Promise((done) => setTimeout(() => done(), 6000));

        isDataAvailable = isPresent;
      } while (isDataAvailable);
    }

    logger.verbose("DONE");
  } catch (error) {
    logger.error("fetchDataFromDB error", error.message);
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

  logger.verbose("Start Processing");

  if (!startDate || !endDate) {
    logger.verbose("Read CSV");
    readCsvData(getBatchData, collection, elkClient, limit, type, prodElkClient);
  } else {
    logger.verbose("Read DB");
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

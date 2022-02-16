require("dotenv").config();
const fs = require("fs");

const chunk = require("lodash/chunk");
const get = require("lodash/get");
const find = require("lodash/find");
const set = require("lodash/set");
const _ = require("lodash");
const logger = require("../logger");

const initDB = require("../src/connector/db");
const initELK = require("../src/connector/elkConnection");
const updateStatusOnReport = require("../src/services/report");
const sendTrackDataToV1 = require("../src/services/v1");
const { getDbCollectionInstance } = require("../src/utils");
const { HOST_NAMES, ELK_INSTANCE_NAMES } = require("../src/utils/constants");

const { MONGO_DB_PROD_SERVER_HOST, MONGO_DB_REPORT_SERVER_HOST } = process.env;

let count = 0;

/**
 *
 * @param {*} data
 * @param {*} collection
 * @param {*} elkClient
 */
const updateTrackingDoc = async (data, collection, elkClient) => {
  const courierTrackingIds = data.map((awb) => `${awb}`);

  const responses = await collection
    .find({ tracking_id: { $in: courierTrackingIds } })
    .project({ status: 1, track_arr: 1, _id: 0, tracking_id: 1 })
    .toArray();

  responses.forEach((trackObj) => {
    const { status, track_arr: trackArr, tracking_id: trackingId } = trackObj;
    const currentStatus = get(status, "current_status_type");
    const isPPFExists = find(trackArr.slice(0, 3), { scan_type: "PPF" });
    const foundIndex = _.findIndex(trackArr.slice(0, 2), { scan_type: "PPF" });
    const firstTrackScanType = get(trackArr, "[0].scan_type");

    // console.log("currentStatus", currentStatus);
    // console.log("firstTrackScanType", firstTrackScanType);
    // console.log("trackingId", trackingId);
    // console.log("status", status);
    // console.log("trackArr", trackArr[0]);

    // if (currentStatus === "PPF" && currentStatus === firstTrackScanType && trackArr.length > 3) {
    //   set(status, "current_status_time", get(trackArr, "[1].scan_datetime"));
    //   set(status, "current_status_type", get(trackArr, "[1].scan_type"));
    //   set(status, "current_status_body", get(trackArr, "[1].scan_status"));
    //   set(status, "current_status_location", get(trackArr, "[1].scan_location"));
    //   set(status, "courier_status_code", get(trackArr, "[1].courier_status_code"));

    //   // count += 1;

    //   // console.log("count", count);

    //   collection
    //     .updateOne({ tracking_id: trackingId }, { $pop: { track_arr: -1 }, $set: { status } })
    //     .then(() => {
    //       count += 1;
    //       console.log("Completed", trackingId, count);
    //     })
    //     .catch((error) => {
    //       console.log("Failed", error);
    //     });
    // }

    if (currentStatus !== "PPF" && isPPFExists && trackArr.length > 3 && foundIndex >= 0) {
      const arrIndex = `track_arr.${foundIndex}`;

      collection
        .updateOne({ tracking_id: trackingId }, { $unset: { [arrIndex]: 1 } })
        .then(() =>
          collection.updateOne({ tracking_id: trackingId }, { $pull: { track_arr: null } })
        )
        .then(() => {
          count += 1;
          console.log("Completed", trackingId, count, foundIndex);
        })
        .catch(console.error);
    }
  });
};

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
      updateTrackingDoc(data, collection, elkClient);
    });

    console.log("Process Completed");
  } catch (error) {
    console.log("Main ERROR", error);
  }
};

main();

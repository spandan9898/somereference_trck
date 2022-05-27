/* eslint-disable no-promise-executor-return */
/* eslint-disable no-restricted-syntax */
const { isEmpty, chunk } = require("lodash");
const moment = require("moment");

const { processBackfilling } = require("../../../scripts/reportBackfill");
const { getDbCollectionInstance } = require("../../utils");
const initELK = require("../../connector/elkConnection");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { ELK_INSTANCE_NAMES } = require("../../utils/constants");

/**
 * 
 * @param {*} rowData 
    {
        tracking_id: '2022161711',
        date: '2022-04-13 4:44:44', // format must be like this
        status: 'RTO'
    }
 */
const prepareStatusObj = ({
  status,
  date,
  tracking_id: trackingId,
  sub_status_code: subStatusCode = "",
  status_text: statusText = "",
}) => {
  const allowedDateFormats = ["MM/DD/YYYY HH:mm:ss", "YYYY-MM-DD HH:mm:ss"];
  let scanDateTime = moment(date, allowedDateFormats);
  scanDateTime = scanDateTime.isValid()
    ? scanDateTime.subtract(330, "minutes").toDate()
    : moment().toDate();
  if (!date) {
    scanDateTime = moment().toDate();
  }
  const trackArrStatus = {
    scan_datetime: scanDateTime,
    scan_status: statusText || PICKRR_STATUS_CODE_MAPPING[status] || status,
    pickrr_sub_status_code: subStatusCode,
    scan_location: "",
    scan_type: status,
    update_source: "manual",
    system_updated_at: moment().toDate(),
  };

  const statusObj = {
    courier_status_code: status,
    current_status_body: trackArrStatus.scan_status,
    current_status_location: "",
    current_status_time: trackArrStatus.scan_datetime,
    current_status_type: status,
    pickrr_sub_status_code: trackArrStatus.pickrr_sub_status_code,
  };
  const auditObj = {
    from: "manual",
    current_status_type: status,
    current_status_time: trackArrStatus.scan_datetime,
    pulled_at: moment().toDate(),
  };

  return {
    trackArrStatus,
    trackingId,
    statusObj,
    auditObj,
  };
};

/**
 *
 * @param {*} csvData
 * @desc filter out already exists data with same status
 */
const checkStatus = async (csvData, pullDbInstance) => {
  const trackingIds = csvData.map((data) => data.tracking_id);
  const aggCursor = await pullDbInstance
    .find({ tracking_id: { $in: trackingIds } }, { projection: { status: 1, tracking_id: 1 } })
    .batchSize(trackingIds.length);

  const trackingObj = {};
  for await (const doc of aggCursor) {
    trackingObj[doc.tracking_id] = doc.status.current_status_type || doc.status.courier_status_code;
  }

  return csvData.filter((rowData) => {
    if (trackingObj[rowData.tracking_id] === "RTD") {
      return false;
    }
    return (
      ["DL", "RTO", "RTD", "OC"].includes(rowData.status) &&
      rowData.status !== trackingObj[rowData.tracking_id]
    );
  });
};

/**
 *
 * @param {*} filteredCsvData
 */
const updateOtherSources = async (filteredCsvData, collection, platformNames) => {
  const trackingIds = filteredCsvData.map((data) => data.tracking_id);

  const elkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.TRACKING.name);
  const prodElkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.PROD.name);

  const chunkedData = chunk(trackingIds, 1000);

  for (const data of chunkedData) {
    processBackfilling(data, collection, elkClient, platformNames, prodElkClient);
    await new Promise((done) => setTimeout(() => done(), 100));
  }
};

/**
 * 
 * @param {[{}]} csvData 
   [{
        tracking_id: '2022161711',
        date: '2022-04-13 4:44:44', // format must be like this
        status: 'RTO'
    }],
 */
const updateStatusFromCSV = async (csvData, platformNames) => {
  if (isEmpty(csvData)) {
    return false;
  }

  const pullDbInstance = await getDbCollectionInstance();
  const filteredCsvData = await checkStatus(csvData, pullDbInstance);

  if (isEmpty(filteredCsvData)) {
    return false;
  }
  const trackData = filteredCsvData.map(prepareStatusObj);

  const response = await pullDbInstance.bulkWrite(
    trackData.map(
      (trackItem) => ({
        updateOne: {
          filter: { tracking_id: trackItem.trackingId },
          update: {
            $set: {
              status: trackItem.statusObj,
              updated_at: moment().toDate(),
              last_update_from: "manual",
              is_manual_update: true,
            },
            $push: {
              audit: trackItem.auditObj,
              track_arr: {
                $each: [trackItem.trackArrStatus],
                $position: 0,
              },
            },
          },
          upsert: false,
        },
      }),
      {
        ordered: true,
      }
    )
  );

  console.log("response", response);
  if (process.env.NODE_ENV === "production") {
    await updateOtherSources(filteredCsvData, pullDbInstance, platformNames);
  }
  return true;
};

module.exports = {
  updateStatusFromCSV,
};

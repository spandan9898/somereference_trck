/* eslint-disable no-restricted-syntax */
const { isEmpty } = require("lodash");
const moment = require("moment");
const { getDbCollectionInstance } = require("../../utils");

const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**
 * 
 * @param {*} rowData 
    {
        tracking_id: '2022161711',
        date: '2022-04-13 4:44:44', // format must be like this
        status: 'RTO'
    }
 */
const prepareStatusObj = ({ status, date, tracking_id: trackingId }) => {
  const allowedDateFormats = ["MM/DD/YYYY HH:mm:ss", "YYYY-MM-DD HH:mm:ss"];
  const trackArrStatus = {
    scan_datetime: moment(date, allowedDateFormats).subtract(330, "minutes").toDate(),
    scan_status: PICKRR_STATUS_CODE_MAPPING[status] || status,
    scan_location: "",
    scan_type: status,
  };

  const statusObj = {
    courier_status_code: status,
    current_status_body: trackArrStatus.scan_status,
    current_status_location: "",
    current_status_time: trackArrStatus.scan_datetime,
    current_status_type: status,
  };
  const auditObj = {
    from: "manual",
    current_status_type: status,
    current_status_time: trackArrStatus.scan_datetime,
    pulled_at: moment().subtract(330, "minutes").toDate(),
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
    trackingObj[doc.tracking_id] = doc.status["status.current_status_type"];
  }

  return csvData.filter((rowData) => {
    if (trackingObj[rowData.tracking_id] === "RTD") {
      return false;
    }
    return (
      ["DL", "RTO", "RTD"].includes(rowData.status) &&
      rowData.status !== trackingObj[rowData.tracking_id]
    );
  });
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
const updateStatusFromCSV = async (csvData) => {
  if (isEmpty(csvData)) {
    return false;
  }

  const pullDbInstance = await getDbCollectionInstance();
  const filteredCsvData = await checkStatus(csvData, pullDbInstance);

  const trackData = filteredCsvData.map(prepareStatusObj);

  const response = await pullDbInstance.bulkWrite(
    trackData.map(
      (tackItem) => ({
        updateOne: {
          filter: { tracking_id: tackItem.trackingId },
          update: {
            $set: {
              status: tackItem.statusObj,
            },
            $push: {
              audit: tackItem.auditObj,
              track_arr: {
                $each: [tackItem.trackArrStatus],
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
  return true;
};

module.exports = {
  updateStatusFromCSV,
};

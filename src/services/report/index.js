const _ = require("lodash");
const moment = require("moment");
const { prepareDataForReportMongo } = require("./preparator");

const { reportMongoCol } = require("./model");
const { sendReportsDataToELK } = require("./helpers");

/**
 *
 * @param {*} trackObj
 * @param {*} logger
 */
const updateStatusOnReport = async (trackObj, logger, elkClient) => {
  const latestScanType = _.get(trackObj, "track_arr[0].scan_type", null);
  if (!latestScanType) {
    logger.info("no scan type found", latestScanType);
    return false;
  }

  // confirm if the same in case of RTD

  if (latestScanType === "CC") {
    logger.info("scan type is CC", latestScanType);
    return false;
  }
  const result = _.pickBy(
    prepareDataForReportMongo(trackObj),
    (val) => val !== null && val !== undefined && val !== ""
  );
  result.last_updated_date = moment().toDate();
  result.last_update_from_kafka = result.last_updated_date;
  sendReportsDataToELK(result, elkClient);
  const opsReportColInstance = await reportMongoCol();
  try {
    const response = await opsReportColInstance.findOneAndUpdate(
      { pickrr_tracking_id: trackObj.tracking_id },
      {
        $set: result,
      },
      {
        returnNewDocument: true,
        returnDocument: "after",
        upsert: false,
      }
    );
    return response.value;
  } catch (error) {
    logger.error("updateStatusonReport Error", error);

    return false;
  }
};

module.exports = updateStatusOnReport;

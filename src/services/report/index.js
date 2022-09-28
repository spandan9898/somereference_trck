const _ = require("lodash");
const moment = require("moment");
const { prepareDataForReportMongo } = require("./preparator");

const { reportMongoCol } = require("./model");
const { findLostDate } = require("./helpers");

/**
 *
 * @param {*} trackObj
 * @param {*} logger
 */
const updateStatusOnReport = async (
  trackObj,
  logger,
  elkClient,
  isManualUpdate = false,
  statusChangedFromPull = false
) => {
  // trackObj contains order_pk
  const latestScanType = _.get(trackObj, "track_arr[0].scan_type", null);
  const latestScanStatus = _.get(trackObj, "track_arr[0].scan_status", "") || "";
  if (
    (["OFP", "PPF", "OP", "OM", "OC"].includes(latestScanType) ||
      latestScanStatus.toLowerCase() === "pickup_cancelled") &&
    !isManualUpdate
  ) {
    return false;
  }
  if (!latestScanType) {
    logger.info("no scan type found", latestScanType);
    return false;
  }

  // confirm if the same in case of RTD

  if (latestScanType === "CC") {
    logger.info("scan type is CC", latestScanType);
    return false;
  }

  if (latestScanType === "OP") {
    logger.info("OP status isn't sent from trackingPushConsumer to reportDB");
    return false;
  }

  const result = _.pickBy(
    prepareDataForReportMongo(trackObj, isManualUpdate),
    (val) => val !== null && val !== undefined && val !== ""
  );
  result.lost_shipment_date = findLostDate(trackObj?.track_arr || [], latestScanType);
  result.last_updated_date = moment().toDate();
  result.last_update_from_kafka = result.last_updated_date;
  if (isManualUpdate) {
    result.last_update_from_manual = result.last_updated_date;
  }

  // if status changed we have to add a new filed called current_status_update_time

  if (statusChangedFromPull) {
    // add new filed current_status_datetime to result object

    const currentStatusUpdateTime = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    result.current_status_update_datetime = currentStatusUpdateTime;
  }
  if (trackObj?.qc_details) {
    result.qc_details = trackObj.qc_details;
  }

  const opsReportColInstance = await reportMongoCol();
  try {
    let filter = { pickrr_tracking_id: trackObj.tracking_id, courier_used: { $nin: ["", null] } };
    if (trackObj.order_pk) {
      filter.order_pk = trackObj.order_pk;
    }
    const response = await opsReportColInstance.findOneAndUpdate(
      filter,
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
    logger.error(`updateStatusonReport Error ${error.stack} ${error}`);

    return false;
  }
};

module.exports = updateStatusOnReport;

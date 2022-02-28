const get = require("lodash/get");
const moment = require("moment");

const logger = require("../../../logger");
const { NEW_STATUS_TO_OLD_MAPPING } = require("../../apps/webhookClients/common/constants");
const { getObject, setObject } = require("../../utils");
const { elkDataUpdate } = require("./elk");

/**
 * @param trackingDoc -> tracking document(same as DB document)
 * @desc prepare current status, current status time and order type and then update ELK
 */
const updateStatusELK = async (trackingDoc, elkClient) => {
  try {
    const trackingId = trackingDoc.tracking_id;
    const currentStatusTime = get(trackingDoc, "status.current_status_time") || "NA";
    const currentStatusType = get(trackingDoc, "status.current_status_type") || "NA";

    await elkDataUpdate({
      elkClient,
      id: trackingId,
      doc: {
        current_status_time: moment(currentStatusTime).subtract(330, "minutes").toDate(),
        current_status_type: NEW_STATUS_TO_OLD_MAPPING[currentStatusType] || currentStatusType,
      },
    });
  } catch (error) {
    logger.error(error.message);
  }
};

/**
 *
 * @param {*} preparedDict
 * @desc fetching processCount, default value is 0
 */
const getTrackingIdProcessingCount = async ({ awb }) => {
  try {
    const cacheData = (await getObject(awb)) || {};
    const { processCount = 0 } = cacheData;
    return processCount;
  } catch (error) {
    logger.error("getTrackingIdProcessingCount", error);
    return 0;
  }
};

/**
 *
 * @param {*} preparedDict
 * @desc update processCount based on provided type, default type is "add". i.e increase value by 1
 */
const updateTrackingProcessingCount = async ({ awb }, type = "add") => {
  try {
    const cacheData = (await getObject(awb)) || {};
    let { processCount = 0 } = cacheData;
    if (type === "add") {
      processCount += 1;
    } else {
      processCount = !processCount ? 0 : processCount - 1;
    }
    cacheData.processCount = processCount;
    await setObject(awb, cacheData);
  } catch (error) {
    logger.error("updateTrackingProcessingCount", error);
  }
};

module.exports = {
  updateStatusELK,
  getTrackingIdProcessingCount,
  updateTrackingProcessingCount,
};

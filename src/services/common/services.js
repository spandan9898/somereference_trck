const get = require("lodash/get");

const logger = require("../../../logger");
const { elkDataUpdate } = require("./elk");

/**
 *
 */
const updateStatusELK = async (trackingDoc, elkClient) => {
  try {
    const trackingId = trackingDoc.tracking_id;
    const currentStatusTime = get(trackingDoc, "status.current_status_time") || "NA";
    const currentStatusType = get(trackingDoc, "status.current_status_type") || "NA";
    await elkDataUpdate({
      upsert: true,
      elkClient,
      id: trackingId,
      doc: {
        current_status_time: currentStatusTime,
        current_status_type: currentStatusType,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    logger.error("updateStatusELK", error);
  }
};

module.exports = {
  updateStatusELK,
};

const get = require("lodash/get");
const moment = require("moment");

const logger = require("../../../logger");
const { elkDataUpdate } = require("./elk");

/**
 * @param trackingDoc -> tracking document(same as DB document)
 * @desc preapre current status, current status time and order type and then update ELK
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
        current_status_time: moment(currentStatusTime).subtract(330, "minutes").toDate(),
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

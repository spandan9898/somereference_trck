const sendTrackDataToV1 = require("../../services/v1");
const updateStatusOnReport = require("../../services/report");
const { updateStatusELK } = require("../../services/common/services");

const { getElkClients } = require("../../utils");
const { fetchTrackingDataFromDB } = require("./helper");

const logger = require("../../../logger");

/**
 * @desc consume data and call other services
 */
const trackAutoSync = async (consumedPayload) => {
  try {
    const payload = JSON.parse(consumedPayload.message.value.toString());
    const { request } = payload || {};
    if (!request) {
      return 0;
    }
    const trackingId = request.awb;

    const trackingData = await fetchTrackingDataFromDB(trackingId);

    if (!trackingData) {
      return 0;
    }

    const { prodElkClient, trackingElkClient } = getElkClients();

    sendTrackDataToV1(trackingData);
    updateStatusOnReport(trackingData, logger, trackingElkClient);
    updateStatusELK(trackingData, prodElkClient);

    return trackingId;
  } catch (error) {
    logger.error("trackAutoSync error: ", error);
    return 0;
  }
};

module.exports = {
  trackAutoSync,
};

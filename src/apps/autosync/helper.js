const commonTrackingInfoCol = require("../../services/pull/model");

/**
 * Fetch whole tracking data from pull DB by tracking id
 */
const fetchTrackingDataFromDB = async (trackingId) => {
  const collectionInstance = await commonTrackingInfoCol();
  const data = await collectionInstance.findOne(
    { tracking_id: trackingId },
    { projection: { audit: 0, mandatory_status_map: 0, _id: 0 } }
  );
  return data;
};

module.exports = {
  fetchTrackingDataFromDB,
};

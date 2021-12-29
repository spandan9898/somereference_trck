const logger = require("../../../logger");
const { getDbCollectionInstance } = require("../../utils/mongo_utils");

/**
 * @desc Get commonTrackingInfo collection instance
 */
const commonTrackingInfoCol = async () => {
  try {
    return await getDbCollectionInstance();
  } catch (error) {
    logger.error("commonTrackingInfoCol Error ", error);
    throw new Error(error);
  }
};

module.exports = commonTrackingInfoCol;

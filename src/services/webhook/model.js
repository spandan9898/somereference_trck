const logger = require("../../../logger");
const { getDbCollectionInstance } = require("../../utils");

/**
 * @desc Get commonTrackingInfo collection instance
 */
const commonWebhookUserInfoCol = async () => {
  try {
    const res = await getDbCollectionInstance({
      collectionName: process.env.MONGO_DB_PROD_WEBHOOK_COLLECTION_NAME,
    });
    return res;
  } catch (error) {
    logger.error("commonWebhookUserInfoCol Error ", error);
    throw new Error(error);
  }
};

module.exports = commonWebhookUserInfoCol;

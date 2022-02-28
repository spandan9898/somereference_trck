const logger = require("../../../logger");
const { getDbCollectionInstance, findOneDocumentFromMongo } = require("../../utils");

const { MONGO_DB_PROD_WEBHOOK_HISTORY_COL_NAME } = process.env;

/**
 * @desc Get commonTrackingInfo collection instance
 */
const commonWebhookUserInfoCol = async () => {
  try {
    const res = await getDbCollectionInstance({
      collectionName: process.env.MONGO_DB_PROD_WEBHOOK_COLLECTION_NAME || "common_webhook_user",
    });
    return res;
  } catch (error) {
    logger.error("commonWebhookUserInfoCol Error ", error);
    throw new Error(error);
  }
};

/**
 * @desc find history map data by tracking id
 */
const fetchWebhookHistoryMapData = async (trackingId) => {
  try {
    const queryObj = {
      $or: [{ courier_tracking_id: trackingId }, { tracking_id: trackingId }],
    };
    const projectionObj = {
      history_map: 1,
      _id: 0,
    };

    const res = await findOneDocumentFromMongo({
      queryObj,
      projectionObj,
      collectionName: MONGO_DB_PROD_WEBHOOK_HISTORY_COL_NAME,
    });
    return res;
  } catch (error) {
    logger.error("findHistoryMapData", error);
    return false;
  }
};

module.exports = { commonWebhookUserInfoCol, fetchWebhookHistoryMapData };

const logger = require("../../../logger");
const { getDbCollectionInstance } = require("../../utils");

/**
 *
 * @param {*} userEmail
 * @desc fetch user notification data
 *
 */
const getUserNotification = async (userEmail) => {
  try {
    const userNotificationColInstance = await getDbCollectionInstance({
      collectionName: process.env.MONGO_DB_USER_NOTIFICATION_COLLECTION_NAME,
    });

    const res = await userNotificationColInstance.findOne(
      { email: userEmail, is_active: true },
      { projection: { _id: 0, logs: 0 } }
    );
    return res;
  } catch (error) {
    logger.error("getUserNotification error", error);
    return {};
  }
};

module.exports = {
  getUserNotification,
};

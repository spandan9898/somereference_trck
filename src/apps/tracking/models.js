const logger = require("../../../logger");
const { getDbCollectionInstance } = require("../../utils");

/**
 *
 * @param {*} param0
 * @returns
 */
const fetchTrackingIdFromClientOrderId = async ({
  clientOrderId,
  authToken = null,
  userPK = null,
}) => {
  try {
    const query = {
      client_order_id: clientOrderId,
    };
    if (authToken) {
      query.auth_token = authToken;
    } else if (userPK) {
      query.user_pk = userPK;
    }
    const projection = {
      tracking_id: 1,
    };
    const pullCollection = await getDbCollectionInstance();
    const listDocs = await pullCollection.find(query).project(projection).toArray();
    return listDocs;
  } catch (error) {
    logger.log("fetchTrackingIdFromClientOrderId", error);
    throw new Error(error);
  }
};
module.exports = { fetchTrackingIdFromClientOrderId };

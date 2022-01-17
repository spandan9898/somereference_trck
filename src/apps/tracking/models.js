const logger = require("../../../logger");
const { findOneDocumentFromMongo } = require("../../utils");

/**
 *
 * @param {*} clientOrderId
 * @param {*} userPK
 * @returns
 */
const fetchTrackingIdFromClientOrderId = async (clientOrderId, userPK) => {
  try {
    const query = {
      client_order_id: clientOrderId,
      user_pk: userPK,
    };
    const projection = {
      tracking_id: 1,
    };
    const res = await findOneDocumentFromMongo({ queryObj: query, projectionObj: projection });
    return res;
  } catch (error) {
    logger.log("fetchTrackingIdFromClientOrderId", error);
    throw new Error(error);
  }
};
module.exports = { fetchTrackingIdFromClientOrderId };

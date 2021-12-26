const { isEmpty } = require("lodash");
const logger = require("../../logger");

/**
 *
 * @param {*} filters
 * @param {*} collection
 */
const findOneDocumentFromMongo = async (queryObj, projectionObj, collection) => {
  let response;
  if (isEmpty(queryObj)) {
    throw new Error("Query object cannot be empty ");
  }
  try {
    if (isEmpty(projectionObj)) {
      response = await collection.findOne(queryObj);
      return response;
    }
    return await collection.findOne(queryObj, { projection: projectionObj });
  } catch (error) {
    logger.error("findOneDocment error -->", error);
  }

  return response;
};

module.exports = { findOneDocumentFromMongo };

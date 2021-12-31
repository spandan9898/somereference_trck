const { isEmpty } = require("lodash");

const logger = require("../../logger");
const initDb = require("../connector/db");

const { HOST_NAMES } = require("./constants");

const { MONGO_DB_PROD_SERVER_DATABASE_NAME, MONGO_DB_PROD_SERVER_COLLECTION_NAME } = process.env;

/**
 *
 * @param {*} collectionName
 * @returns collection instance
 */
const getDbCollectionInstance = async ({
  dbName = MONGO_DB_PROD_SERVER_DATABASE_NAME,
  collectionName = MONGO_DB_PROD_SERVER_COLLECTION_NAME,
  hostName = HOST_NAMES.PULL_DB,
} = {}) => {
  try {
    const dbInstance = initDb.getDbInstance(hostName);
    const res = dbInstance.db(dbName).collection(collectionName);
    return res;
  } catch (error) {
    logger.error("getDbCollectionInstance Error ", error);
    throw new Error(error);
  }
};

/**
 *
 * @param {*} filters
 * @param {*} collection
 */
const findOneDocumentFromMongo = async ({ queryObj, projectionObj, collectionName }) => {
  const collection = await getDbCollectionInstance({ collectionName });
  let response;
  if (isEmpty(queryObj)) {
    throw new Error("Query object cannot be empty ");
  }
  try {
    if (isEmpty(projectionObj)) {
      return await collection.findOne(queryObj);
    }
    return await collection.findOne(queryObj, { projection: projectionObj });
  } catch (error) {
    logger.error("findOneDocment error -->", error);
  }

  return response;
};

module.exports = { findOneDocumentFromMongo, getDbCollectionInstance };

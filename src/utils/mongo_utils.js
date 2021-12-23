/**
 *
 * @param {*} filters
 * @param {*} collection
 */
const findOneDocumentFromMongo = async (filters, collection) => {
  const res = (await collection.findOne(filters)) || {};
  return res;
};

module.exports = { findOneDocumentFromMongo };

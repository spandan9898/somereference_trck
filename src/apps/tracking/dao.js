/**
 *
 * @param {*} filters
 * @param {*} collection
 */
const findOneDocument = async (filters, collection) => {
  const res = (await collection.findOne(filters)) || {};
  return res;
};

module.exports = findOneDocument;

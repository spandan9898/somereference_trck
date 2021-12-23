/**
 *
 * @param {*} filters
 * @param {*} collection
 */
const findOneDocumentFromMongo = async (filters, collection) => {
  const res = (await collection.findOne(filters)) || {};
  return res;
};

/**
 *
 * @param {*} findFilters
 * @param {*} projectfilters
 * @param {*} collection
 */
const findandProject = async (findFilters, projectfilters, collection) => {
  let response;
  try {
    response = await collection.findOne(findFilters, { projection: { projectfilters } });
    return response;
  } catch (error) {
    console.log("some error at findandProject");
  }
  return response;
};

module.exports = { findOneDocumentFromMongo, findandProject };

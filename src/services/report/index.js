/**
 * update document on reportMongo
 */

const { prepareDataForReportMongo } = require("./preparator");

const { reportMongoCol } = require("./model");

/**
 *
 * @param {*} trackObj
 * @param {*} logger
 */
const updateStatusonReport = async (trackObj, logger) => {
  const result = await prepareDataForReportMongo(trackObj);
  const reportConnection = await reportMongoCol();
};

module.exports = updateStatusonReport;

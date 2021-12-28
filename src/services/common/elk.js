const logger = require("../../../logger");

/**
 *
 * send data to elk
 */
const sendDataToElk = async ({ body, elkClient, indexName = "track-reports" }) => {
  try {
    const res = await elkClient.index({
      index: indexName,
      body,
    });
    return res;
  } catch (error) {
    logger.error("ELK Error", error);
    return "";
  }
};

module.exports = { sendDataToElk };

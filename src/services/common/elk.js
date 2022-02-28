const { nanoid } = require("nanoid");

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

/**
 *
 * @desc update data in ELK
 * @returns
 */
const elkDataUpdate = async ({
  doc,
  elkClient,
  indexName = "status_index_3",
  id = nanoid(5),
  upsert = false,
}) => {
  try {
    const response = await elkClient.update({
      index: indexName,
      id,
      body: {
        doc,
        doc_as_upsert: upsert,
      },
      retry_on_conflict: 3,
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { sendDataToElk, elkDataUpdate };

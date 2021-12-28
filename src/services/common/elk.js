/**
 *
 * send trackinginfo data to elk
 */
const sendDataToElk = async ({ awb, data, elkClient, logger, indexName = "track-reports" }) => {
  try {
    await elkClient.index({
      index: indexName,
      body: {
        awb: awb.toString(),
        payload: JSON.stringify(data),
        time: new Date(),
      },
    });
  } catch (error) {
    logger.error("ELK Error", error);
  }
};

module.exports = { sendDataToElk };

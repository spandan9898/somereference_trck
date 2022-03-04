const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

/**
 *
 */
(async () => {
  try {
    const { consumerMapwithPartitions } = await initialize();
    consumerMapwithPartitions.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res, true);
          }
        })
        .catch((error) => {
          logger.error("Pidge Consumer Initialization Error", error);
        });
    });
  } catch (error) {
    logger.error("Pidge Consumer Error", error);
  }
})();

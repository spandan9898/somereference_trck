const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

/**
 *
 */
(async () => {
  try {
    const { consumerMapwithPartitions, pullConsumer } = await initialize();
    consumerMapwithPartitions.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res, true);
          }
        })
        .catch((error) => {
          logger.error("Dtdc Consumer Initialization Error", error);
        });
    });
    listener(pullConsumer, true);
  } catch (error) {
    logger.error("Dtdc Consumer Error", error);
  }
})();

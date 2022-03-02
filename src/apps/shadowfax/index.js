const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const { consumerMapWithTopics, consumerMapWithPartitions } = await initialize();

    consumerMapWithTopics.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res);
          }
        })
        .catch((error) => {
          logger.error("Shadowfax Consumer Initialize Error", error);
        });
    });
    consumerMapWithPartitions.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res, true);
          }
        })
        .catch((error) => {
          logger.error("Shadowfax Consumer Initialize Error", error);
        });
    });
  } catch (error) {
    logger.error("Shadowfax Consumer Error", error);
    throw new Error(error);
  }
})();

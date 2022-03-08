const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const { partitionConsumerInstances, consumerMapWithPartitions } = await initialize();

    partitionConsumerInstances.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res);
          }
        })
        .catch((error) => {
          logger.error("Shadowfax  Push Consumer Initialize Error", error);
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

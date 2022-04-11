const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const { topicConsumerInstances, pushPartitionsConsumerInstances } = await initialize();

    topicConsumerInstances.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res);
          }
        })
        .catch((error) => {
          logger.error("XBS Consumer Initialize Error", error);
        });
    });
    pushPartitionsConsumerInstances.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res, true);
          }
        })
        .catch((error) => {
          logger.error("XBS Consumer Initialize Error", error);
        });
    });
  } catch (error) {
    logger.error("XBS Consumer Error", error);
    throw new Error(error);
  }
})();

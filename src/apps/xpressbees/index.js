const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const { topicConsumerInstances, pushConsumerInstance } = await initialize();

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
    listener(pushConsumerInstance, true);
  } catch (error) {
    logger.error("XBS Consumer Error", error);
    throw new Error(error);
  }
})();

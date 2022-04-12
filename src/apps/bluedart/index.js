const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pushConsumer, topicConsumerInstances } = await initialize();

    topicConsumerInstances.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res, 1);
          }
        })
        .catch((error) => {
          logger.error("Bluedart Consumer Initialize Error", error);
        });
    });

    listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Bluedart Consumer Error", error);
    throw new Error(error);
  }
})();

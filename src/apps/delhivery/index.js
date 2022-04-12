const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { DELHIVERY_PULL_PARTITION_COUNT, DELHIVERY_PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { consumersWithMultiTopics, pullConsumer, pushConsumerInstance } = await initialize();
    consumersWithMultiTopics.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res, 1);
          }
        })
        .catch((error) => {
          logger.error("Delhivery Consumer Initialize Error ", error);
        });
    });
    listener(pullConsumer, DELHIVERY_PULL_PARTITION_COUNT);
    listener(pushConsumerInstance, DELHIVERY_PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Delhivery Consumer Error ", error);
  }
})();

const logger = require("../../../logger");
const { PUSH_PARTITION_COUNT } = require("./constant");
const { listener, initialize } = require("./consumer");

(async () => {
  try {
    const { topicConsumerInstances, pushConsumer } = await initialize();

    topicConsumerInstances.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res, 1);
          }
        })
        .catch((error) => {
          logger.error("Parceldo Consumer Initialize Error", error);
        });
    });
    listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Parceldo Consumer Error", error);
    throw new Error(error);
  }
})();

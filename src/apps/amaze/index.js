/* eslint-disable no-console */
const logger = require("../../../logger");
const { listener, initialize } = require("./consumer");
const { PUSH_PARTITION_COUNT } = require("./constant");

/**
 *
 */
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
          logger.error("Amaze Consumer Initialize Error", error);
        });
    });
    listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Amaze Consumer Error", error);
    throw new Error(error);
  }
})();

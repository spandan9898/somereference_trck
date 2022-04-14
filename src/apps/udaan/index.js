const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PUSH_PARTITION_COUNT } = require("./constant");

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
          logger.error("Udaan Consumer Initialize Error", error);
        });
    });
    await listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Udaan Consumer Error", error);
    throw new Error(error);
  }
})();

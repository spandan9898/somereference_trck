const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { BLUEDART_PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { topicConsumerInstances, pushConsumer } = await initialize();

    topicConsumerInstances.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res);
          }
        })
        .catch((error) => {
          logger.error("Bluedart Consumer Initialize Error", error);
        });
    });
    listener(pushConsumer, BLUEDART_PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Bluedart Consumer Error", error);
    throw new Error(error);
  }
})();

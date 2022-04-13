const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PARTITION_COUNT } = require("./constant");

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
          logger.error("Ekart Consumer Initialize Error", error);
        });
    });
    listener(pushConsumer, PARTITION_COUNT);
  } catch (error) {
    logger.error("Ekart Consumer Error", error);
    throw new Error(error);
  }
})();

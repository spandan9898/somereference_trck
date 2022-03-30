const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const { consumersWithMultiTopics, pullConsumer } = await initialize();
    consumersWithMultiTopics.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res);
          }
        })
        .catch((error) => {
          logger.error("Delhivery Consumer Initialize Error ", error);
        });
    });
    listener(pullConsumer, true);
  } catch (error) {
    logger.error("Delhivery Consumer Error ", error);
  }
})();

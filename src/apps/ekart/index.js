const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PULL_PARTITION_COUNT, PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pullConsumer, pushConsumer } = await initialize();
    listener(pullConsumer, PULL_PARTITION_COUNT);
    listener(pushConsumer, PARTITION_COUNT);
  } catch (error) {
    logger.error("Ekart Consumer Error", error);
    throw new Error(error);
  }
})();

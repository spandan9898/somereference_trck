const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PUSH_PARTITION_COUNT, PULL_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pushConsumer, pullConsumer } = await initialize();
    listener(pushConsumer, PUSH_PARTITION_COUNT);
    listener(pullConsumer, PULL_PARTITION_COUNT);
  } catch (error) {
    logger.error("Bluedart Consumer Error", error);
  }
})();

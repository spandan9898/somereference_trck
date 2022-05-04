const logger = require("../../../logger");
const { PULL_PARTITION_COUNT, PUSH_PARTITION_COUNT } = require("./constant");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const { pushConsumer, pullConsumer } = await initialize();
    listener(pullConsumer, PULL_PARTITION_COUNT);
    listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Shadowfax Consumer Error", error);
  }
})();

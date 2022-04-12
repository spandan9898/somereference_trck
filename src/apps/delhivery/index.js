const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PULL_PARTITION_COUNT, PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pullConsumer, pushConsumer } = await initialize();
    listener(pullConsumer, PULL_PARTITION_COUNT);
    listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Delhivery Consumer Error ", error);
  }
})();

const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { DELHIVERY_PULL_PARTITION_COUNT, DELHIVERY_PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pullConsumer, pushConsumer } = await initialize();
    listener(pullConsumer, DELHIVERY_PULL_PARTITION_COUNT);
    listener(pushConsumer, DELHIVERY_PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Delhivery Consumer Error ", error);
  }
})();

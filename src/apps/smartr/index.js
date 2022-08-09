const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PULL_PARTITION_COUNT, PUSH_PARTITION_COUNT } = require("./constant");

/**
 *
 */
(async () => {
  try {
    const { pullConsumer } = await initialize();
    listener(pullConsumer, PULL_PARTITION_COUNT);
    const { pushConsumer } = await initialize();
    if (process.env.CONSUME_PUSH_EVENTS === "true") {
      listener(pushConsumer, PUSH_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Smartr Consumer Error", error);
  }
})();

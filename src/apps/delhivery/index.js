const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PULL_PARTITION_COUNT, PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pullConsumer, pushConsumer } = await initialize();
    if (process.env.CONSUME_PULL_EVENTS.toLowerCase() === "true") {
      listener(pullConsumer, PULL_PARTITION_COUNT);
    }
    if (process.env.CONSUME_PUSH_EVENTS.toLowerCase() === "true") {
      listener(pushConsumer, PUSH_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Delhivery Consumer Error ", error);
  }
})();

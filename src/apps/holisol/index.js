const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PULL_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pullConsumer } = await initialize();
    if (process.env.CONSUME_PULL_EVENTS.toLowerCase() === "true") {
      listener(pullConsumer, PULL_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Ekart Consumer Error", error);
  }
})();

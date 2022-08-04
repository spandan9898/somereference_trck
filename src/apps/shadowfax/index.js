const logger = require("../../../logger");
const { PULL_PARTITION_COUNT, PUSH_PARTITION_COUNT } = require("./constant");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const { pushConsumer, pullConsumer } = await initialize();
    if (process.env.CONSUME_PULL_EVENTS === "true") {
      listener(pullConsumer, PULL_PARTITION_COUNT);
    }
    if (process.env.CONSUME_PUSH_EVENTS === "true") {
      listener(pushConsumer, PUSH_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Shadowfax Consumer Error", error);
  }
})();

const logger = require("../../../logger");
const { DTDC_PARTITION_COUNT, PULL_CONSUMER_PARTITION_COUNT } = require("./constant");
const { initialize, listener } = require("./consumer");

/**
 *
 */
(async () => {
  try {
    const { pullConsumer, pushConsumer } = await initialize();
    if (process.env.CONSUME_PULL_EVENTS.toLowerCase() === "true") {
      listener(pullConsumer, PULL_CONSUMER_PARTITION_COUNT);
    }
    if (process.env.CONSUME_PUSH_EVENTS.toLowerCase() === "true") {
      listener(pushConsumer, DTDC_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Dtdc Consumer Error ", error);
  }
})();

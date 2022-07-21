/* eslint-disable no-console */
const logger = require("../../../logger");
const { listener, initialize } = require("./consumer");
const { PUSH_PARTITION_COUNT } = require("./constant");

/**
 *
 */
(async () => {
  try {
    const { pushConsumer } = await initialize();
    if (process.env.CONSUME_PUSH_EVENTS.toLowerCase() === "true") {
      listener(pushConsumer, PUSH_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Amaze Consumer Error", error);
  }
})();

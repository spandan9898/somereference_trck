const logger = require("../../../logger");
const { PULL_PARTITION_COUNT } = require("./constant");
const { initialize, listener } = require("./consumer");

/**
 *
 */
(async () => {
  try {
    const pullConsumer = await initialize();
    if (process.env.CONSUME_PULL_EVENTS.toLowerCase() === "true") {
      await listener(pullConsumer, PULL_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("kerryIndev Consumer Error ", error);
  }
})();

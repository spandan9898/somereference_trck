const logger = require("../../../logger");
const { PULL_PARTITION_COUNT } = require("./constant");
const { initialize, listener } = require("./consumer");

/**
 *
 */
(async () => {
  try {
    const pullConsumer = await initialize();
    listener(pullConsumer, PULL_PARTITION_COUNT);
  } catch (error) {
    logger.error("kerryIndev Consumer Error ", error);
  }
})();

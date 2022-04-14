const logger = require("../../../logger");
const { PUSH_PARTITION_COUNT } = require("./constant");
const { initialize, listener } = require("./consumer");

/**
 *
 */
(async () => {
  try {
    const { pushConsumer } = await initialize();
    listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Dtdc Consumer Error", error);
  }
})();

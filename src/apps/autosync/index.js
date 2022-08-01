const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PARTITION_COUNT } = require("./constants");

(async () => {
  try {
    const { pushConsumer } = await initialize();
    if (process.env.CONSUME_AUTOSYNC_DATA === "true") {
      listener(pushConsumer, PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Auto Sync Consumer Error", error);
    throw new Error(error);
  }
})();

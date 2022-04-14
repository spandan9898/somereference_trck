const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pushConsumer } = await initialize();
    listener(pushConsumer, PARTITION_COUNT);
  } catch (error) {
    logger.error("Ekart Consumer Error", error);
    throw new Error(error);
  }
})();

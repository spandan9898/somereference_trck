const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pushConsumer } = await initialize();
    await listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Udaan Consumer Error", error);
    throw new Error(error);
  }
})();

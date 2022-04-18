const logger = require("../../../logger");
const { PUSH_PARTITION_COUNT } = require("./constant");
const { listener, initialize } = require("./consumer");

(async () => {
  try {
    const { pushConsumer } = await initialize();
    listener(pushConsumer, PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("Parceldo Consumer Error", error);
    throw new Error(error);
  }
})();

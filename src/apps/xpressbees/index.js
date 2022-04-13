const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { XBS_PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pushConsumerInstance } = await initialize();

    listener(pushConsumerInstance, XBS_PUSH_PARTITION_COUNT);
  } catch (error) {
    logger.error("XBS Consumer Error", error);
    throw new Error(error);
  }
})();

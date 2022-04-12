const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const { pushConsumerInstance } = await initialize();

    listener(pushConsumerInstance, true);
  } catch (error) {
    logger.error("XBS Consumer Error", error);
    throw new Error(error);
  }
})();

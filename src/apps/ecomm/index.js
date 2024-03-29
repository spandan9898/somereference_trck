const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const { PUSH_PARTITION_COUNT } = require("./constant");

(async () => {
  try {
    const { pushConsumer } = await initialize();

    // disable consumption of ecomm push events

    if (process.env.CONSUME_PUSH_EVENTS.toLowerCase() === "true") {
      listener(pushConsumer, PUSH_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Ecomm Consumer Error", error);
  }
})();

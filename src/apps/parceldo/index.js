const logger = require("../../../logger");
const { PUSH_PARTITION_COUNT } = require("./constant");
const { listener, initialize } = require("./consumer");

(async () => {
  try {
    const { pushConsumer } = await initialize();
    if (process.env.CONSUME_PUSH_EVENTS.toLowerCase() === "true") {
      listener(pushConsumer, PUSH_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Parceldo Consumer Error", error);
  }
})();

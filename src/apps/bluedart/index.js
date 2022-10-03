const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");
const {
  PUSH_PARTITION_COUNT,

  // PULL_PARTITION_COUNT
} = require("./constant");

(async () => {
  try {
    const { pushConsumer } = await initialize();

    // if (process.env.CONSUME_PULL_EVENTS.toLowerCase() === "true") {
    //   await listener(pullConsumer, PULL_PARTITION_COUNT);
    // }

    if (process.env.CONSUME_PUSH_EVENTS.toLowerCase() === "true") {
      listener(pushConsumer, PUSH_PARTITION_COUNT);
    }
  } catch (error) {
    logger.error("Bluedart Consumer Error", error);
  }
})();

const logger = require("../../../logger");
const { listener, initialize } = require("./consumer");

(async () => {
  try {
    const pickrrConnectConsumers = await initialize();
    if (process.env.CONSUME_PICKRR_CONNECT_DATA) {
      listener(pickrrConnectConsumers);
    }
  } catch (error) {
    logger.error("Pickrr Connect Consumer Error ", error);
  }
})();

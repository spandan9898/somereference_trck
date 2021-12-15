/* eslint-disable no-console */
const logger = require("../../../logger");
const { listener, initialize } = require("./consumer");

/**
 *
 */
(async () => {
  try {
    const amazeConsumers = await initialize();
    amazeConsumers.forEach((consumer) => {
      consumer
        .then((response) => {
          if (response) {
            listener(response);
          }
        })
        .catch((error) => logger.error("Amaze consumer", error));
    });
  } catch (error) {
    throw new Error(error);
  }
})();

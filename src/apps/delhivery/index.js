const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const consumers = await initialize();
    consumers.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res);
          }
        })
        .catch((error) => {
          logger.error("Delhivery Consumer Initialize Error ", error);
        });
    });
  } catch (error) {
    logger.error("Delhivery Consumer Error ", error);
  }
})();

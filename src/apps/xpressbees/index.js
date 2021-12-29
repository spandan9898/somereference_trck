const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  const xbsConsumers = await initialize();
  xbsConsumers.forEach((consumer) => {
    consumer
      .then((res) => {
        if (res) {
          listener(res);
        }
      })
      .catch((err) => logger.error("XBS Consumer Error", err));
  });
})();

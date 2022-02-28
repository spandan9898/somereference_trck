const logger = require("../../../logger");
const { listener, initialize } = require("./consumer");

(async () => {
  const pickrrConnectConsumers = await initialize();
  pickrrConnectConsumers.forEach((consumer) => {
    consumer
      .then((response) => {
        if (response) {
          listener(response);
        }
      })
      .catch((err) => logger.error("Pickrr Connect Consumer Error ", err));
  });
})();

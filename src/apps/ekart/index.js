const logger = require("../../../logger");
const { initialize, listener } = require("./consumer");

(async () => {
  const { consumersWithMultiTopics, pullConsumerInstance } = await initialize();
  consumersWithMultiTopics.forEach((consumer) => {
    consumer
      .then((res) => {
        if (res) {
          listener(res);
        }
      })
      .catch((err) => logger.error("Ekart Consumer Error ", err));
  });
  listener(pullConsumerInstance, true);
})();

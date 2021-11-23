const { initialize, listener } = require("./consumer");

(async () => {
  const xbsConsumers = await initialize();
  xbsConsumers.forEach((consumer) => {
    consumer
      .then((res) => {
        listener(res);
      })
      .catch((err) => console.log(err.message));
  });
})();

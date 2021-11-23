const { initialize, listener } = require("./consumer");

(async () => {
  const udaanConsumers = await initialize();
  udaanConsumers.forEach((consumer) => {
    consumer
      .then((res) => {
        listener(res);
      })
      .catch((error) => console.log(error));
  });
})();

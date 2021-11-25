const { initialize, listener } = require("./consumer");

(async () => {
  const ekartConsumers = await initialize();

  ekartConsumers.forEach((consumer) => {
    consumer
      .then((res) => {
        if (res) {
          listener(res);
        }
      })
      .catch((err) => console.log(err));
  });
})();

const { listener, initialize } = require("./consumer");

(async () => {
  const ecommConsumers = await initialize();
  ecommConsumers.forEach((consumer) => {
    consumer
      .then((res) => {
        listener(res);
      })
      .catch((err) => console.log(err));
  });
})();

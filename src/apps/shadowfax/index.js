const { listener, initialize } = require("./consumer");

(async () => {
  const shadowfaxConsumers = await initialize();
  shadowfaxConsumers.forEach((consumer) => {
    consumer
      .then((res) => {
        listener(res);
      })
      .catch((err) => console.log(err.message));
  });
})();

const { listener, initialize } = require("./consumer");

(async () => {
  const ecommConsumers = await initialize();
  ecommConsumers.forEach((consumer) => {
    consumer
      .then((response) => {
        if (response) {
          listener(response);
        }
      })
      .catch((err) => console.log(err));
  });
})();

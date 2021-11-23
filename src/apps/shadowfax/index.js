const { listener, initialize } = require("./consumer");

(async () => {
  const shadowfaxConsumers = await initialize();
  shadowfaxConsumers.forEach((consumer) => {
    consumer
      .then((res) => {
        if (res) {
          listener(res);
        }
      })
      .catch((err) => console.log(err.message));
  });
})();

const { listener, initialize } = require("./consumer");

(async () => {
  const shadowfaxConsumers = await initialize();
  console.log("shadowfaxConsumers", shadowfaxConsumers);
  shadowfaxConsumers.forEach((consumer) => {
    consumer
      .then((res) => {
        if (res) {
          console.log("listening");
          listener(res);
        }
      })
      .catch((err) => console.log(err.message));
  });
})();

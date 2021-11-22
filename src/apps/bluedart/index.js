const { initialize, listener } = require("./consumer");

(async () => {
  const consumers = await initialize();

  consumers.forEach((consumer) => {
    consumer
      .then((res) => {
        listener(res);
      })
      .catch((err) => console.log(err));
  });
})();

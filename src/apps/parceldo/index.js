const { listener, initialize } = require("./consumer");

(async () => {
  const parceldoConsumers = await initialize();
  parceldoConsumers.forEach((consumer) => {
    consumer
      .then((response) => {
        if (response) {
          listener(response);
        }
      })
      .catch((err) => console.log(err.message));
  });
})();

const { initialize, listener } = require("./consumer");

(async () => {
  try {
    const consumers = await initialize();
    consumers.forEach((consumer) => {
      consumer
        .then((res) => {
          if (res) {
            listener(res);
          }
        })
        .catch((err) => console.log(err));
    });
  } catch (error) {
    // TODO: notify

    throw new Error(error);
  }
})();

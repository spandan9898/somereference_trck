/* eslint-disable no-console */
const { listener, initialize } = require("./consumer");

/**
 *
 */
(async () => {
  try {
    const amazeConsumers = await initialize();
    amazeConsumers.forEach((consumer) => {
      consumer
        .then((res) => {
          listener(res);
        })
        .catch((error) => console.log(error));
    });
  } catch (error) {
    throw new Error(error);
  }
})();

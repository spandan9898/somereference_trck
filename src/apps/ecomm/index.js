const { listener, initialize } = require("./consumer");

(async () => {
  const ecommConsumer = await initialize();
  await listener(ecommConsumer);
})();

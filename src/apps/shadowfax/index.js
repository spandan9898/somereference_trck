const { listener, initialize } = require("./consumer");

(async () => {
  const shadowfaxConsumer = await initialize();
  await listener(shadowfaxConsumer);
})();

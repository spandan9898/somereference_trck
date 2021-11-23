const { listener, initialize } = require("./consumer");

(async () => {
  const consumer = await initialize();
  await listener(consumer);
})();

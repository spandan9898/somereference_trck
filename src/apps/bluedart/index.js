const { initialize, listener } = require("./consumer");

(async () => {
  const consumer = await initialize();
  await listener(consumer);
})();

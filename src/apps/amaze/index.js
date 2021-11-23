const { listener, initialize } = require("./consumer");

/**
 *
 */
(async () => {
  const amazeConsumer = await initialize();
  await listener(amazeConsumer);
})();

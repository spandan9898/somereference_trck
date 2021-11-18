const { listener } = require("./consumer");

(async () => {
  await listener();
})();

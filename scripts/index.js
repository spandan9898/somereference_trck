const { backfillHandler } = require("./handlers");

module.exports = async (fastify) => {
  fastify.route({
    method: "POST",
    url: "/backfill",
    handler: backfillHandler,
  });
};

const { track: trackingHandler } = require("./handlers");

module.exports = async (fastify) => {
  fastify.route({
    method: "GET",
    url: "/tracking",
    handler: trackingHandler,
  });
};

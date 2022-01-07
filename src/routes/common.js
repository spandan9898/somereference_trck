const commonRoutes = require("../apps/common");

module.exports = async (fastify) => {
  fastify.register(commonRoutes, { prefix: "/common/" });
};

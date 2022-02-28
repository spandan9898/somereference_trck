const commonRoutes = require("./common");

module.exports = async (fastify) => ({
  ...(await commonRoutes(fastify)),
});

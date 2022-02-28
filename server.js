// import dependencies from npm

const Fastify = require("fastify");
const cors = require("fastify-cors");
const {
  clientTracking,
  publicTracking,
  updateClientOrderIdCache,
} = require("./src/apps/tracking/handlers");
const routes = require("./src/routes");

let serverInstance;

/**
 *
 * @param {*} options
 */
const createServer = async () => {
  // create the server

  const server = Fastify({
    ignoreTrailingSlash: true,
    logger: true,
  });

  // start the server

  // server.register(trackRoutes, { prefix: "/track" });

  server.register(cors);

  server.get("/track/tracking", clientTracking);
  server.get("/tracking", publicTracking);
  server.get("/update-client-order-id-cache", updateClientOrderIdCache);
  server.register(routes);
  await server.ready();

  server.listen(process.env.PORT || 3000, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    serverInstance = server;
    server.log.info("Server Started");
  });
};

/** */
const getServerInstance = () => serverInstance;

module.exports = {
  createServer,
  getServerInstance,
};

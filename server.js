// import dependencies from npm

const Fastify = require("fastify");
const path = require("path");
const AutoLoad = require("fastify-autoload");
const { ServerResponse } = require("http");
const trackRoutes = require("./src/apps/tracking");

let serverInstance;

/**
 *
 * @param {*} options
 */
const createServer = (logger) => {
  // create the server

  const server = Fastify({
    ignoreTrailingSlash: true,
    logger: true,
  });

  // start the server

  // server.register(trackRoutes, { prefix: "/track" });

  server.get("/", async (request, reply) => {
    reply.type("application/json").code(200);
    return { hello: "world" };
  });

  server.post("/webhook-test/shopclues", async (request, reply) => {
    reply.type("application/json").code(200);
    return { success: true, data: { message: "Success", body: request.body } };
  });

  server.post("/webhook-test/naaptol", async (request, reply) => {
    reply.type("application/json").code(200);
    return { success: true, HasError: "False", data: { message: "Success", body: request.body } };
  });

  server.post("/webhook-test/common", async (request, reply) => {
    reply.type("application/json").code(200);
    return { success: true, HasError: "False", data: { message: "Success", body: request.body } };
  });

  server.post("/track/external/push/bluedart", async (request, reply) => {
    reply.type("application/json").code(200);
    logger.info("Testing Nginx", request.body);
    return { hello: "world", body: request.body };
  });

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

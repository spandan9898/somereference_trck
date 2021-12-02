// import dependencies from npm

const Fastify = require("fastify");
const path = require("path");
const AutoLoad = require("fastify-autoload");
const { ServerResponse } = require("http");

let serverInstance;

const createServer = (options) => {
  // create the server

  const server = Fastify({
    ignoreTrailingSlash: true,
    logger: true,
  });

  // start the server

  server.get("/", async (request, reply) => {
    reply.type("application/json").code(200);
    return { hello: "world" };
  });

  server.listen(9000, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    serverInstance = server;
    server.log.info("Server Started");
  });
};

const getServerInstance = () => serverInstance;

module.exports = {
  createServer,
  getServerInstance,
};

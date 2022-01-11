const { webhookUserUpdateSchema } = require("./schemas");
const { webhookUserUpdateHandler } = require("./handlers");

module.exports = async (fastify) => {
  fastify.route({
    method: "GET",
    url: "webhook-user-cache-update",
    schema: webhookUserUpdateSchema,
    handler: webhookUserUpdateHandler,
  });
};

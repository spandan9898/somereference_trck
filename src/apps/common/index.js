const { webhookUserUpdateSchema } = require("./schemas");
const { webhookUserUpdateHandler } = require("./handlers");
const { returnHeaders } = require("./handlers/common");
const { backfillHandler } = require("../../../scripts/handlers");

module.exports = async (fastify) => {
  fastify.route({
    method: "GET",
    url: "webhook-user-cache-update",
    schema: webhookUserUpdateSchema,
    handler: webhookUserUpdateHandler,
  });
  fastify.route({
    method: "GET",
    url: "return-headers",
    handler: returnHeaders,
  });
  fastify.route({
    method: "POST",
    url: "backfill",
    handler: backfillHandler,
  });
};

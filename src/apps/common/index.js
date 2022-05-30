const { webhookUserUpdateSchema } = require("./schemas");
const { webhookUserUpdateHandler } = require("./handlers");
const { backfillHandler } = require("../../../scripts/handlers");
const {
  returnHeaders,
  reportBackfilling,
  updateStatus,
  toggleManualStatusUpdate,
} = require("./handlers/common");

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
    config: {
      rateLimit: {
        max: 10,
        timeWindow: "1 minute",
      },
    },
  });
  fastify.route({
    method: "POST",
    url: "report-backfilling",
    handler: reportBackfilling,
  });
  fastify.route({
    method: "POST",
    url: "status-update",
    handler: updateStatus,
  });
  fastify.route({
    method: "POST",
    url: "toggle-update",
    handler: toggleManualStatusUpdate,
  });
};

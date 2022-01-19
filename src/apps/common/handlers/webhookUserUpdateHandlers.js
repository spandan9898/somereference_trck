const { updateAllEnabledWebhookUserDataInCache } = require("../../../services/webhook/services");

module.exports = async function webhookUserHandler(req, reply) {
  await updateAllEnabledWebhookUserDataInCache();
  reply.code(200).send({ success: true, message: "Success" });
};

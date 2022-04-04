const RequestIp = require("@supercharge/request-ip");
const moment = require("moment");
const startProcess = require("../../../../scripts/reportBackfill");

module.exports.returnHeaders = async (req, reply) => {
  const IP = RequestIp.getClientIp(req);
  const replydict = {
    IP,
    headers: req.headers,
  };
  return reply.code(200).send(replydict);
};

module.exports.reportBackfilling = async (req, reply) => {
  const { body } = req;
  const { authToken, lastNDays = 1, type = ["v1"], limit } = body || {};
  const startDate = moment().subtract(lastNDays, "days").format("DD-MM-YYYY");
  const endDate = moment().format("DD-MM-YYYY");
  await startProcess({
    authToken,
    startDate,
    endDate,
    type,
    limit,
  });
  return reply.code(200).send(body);
};

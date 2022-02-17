const RequestIp = require("@supercharge/request-ip");

module.exports.returnHeaders = async (req, reply) => {
  const IP = RequestIp.getClientIp(req);
  const replydict = {
    IP,
    headers: req.headers,
  };
  return reply.code(200).send(replydict);
};

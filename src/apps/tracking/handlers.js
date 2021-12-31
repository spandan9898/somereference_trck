/* eslint-disable import/no-unresolved */

const RequestIp = require("@supercharge/request-IP");
const { isEmpty } = require("lodash");
const { ALLOWED_IPS, BLOCKED_IPS } = require("../../utils/constants");
const { prepareTrackingRes } = require("./preparator");
const { fetchTrackingService } = require("./services");

module.exports.track = async (req, reply) => {
  let trackingIds = null;
  let clientOrderIds = null;
  const authToken = req.query?.auth_token || null;
  let IP = RequestIp.getClientIp(req);
  const hostName = req?.hostname || null;
  let verifiedByHost = false;
  let valid = true;
  if (BLOCKED_IPS.includes(IP)) {
    return reply.code(200).send({ status: "" });
  }
  if (hostName.toLowerCase().includes("pickrr.com")) {
    verifiedByHost = true;
  }
  const { query } = req;
  if (query.tracking_id) {
    trackingIds = query.tracking_id
      .replace("\n", "")
      .replace("\t", "")
      .replace("\r", "")
      .replace(" ", "");
  } else if (query.client_order_id) {
    clientOrderIds = query.client_order_id
      .replaceAll(" ", "")
      .replace("\n", "")
      .replace("\t", "")
      .replace("\r", "")
      .replace(" ", "");
  } else {
    return reply.code(200).send({ err: "invalid request" });
  }
  if (!authToken) {
    valid = false;
  }
  if (IP && ALLOWED_IPS.includes(IP)) {
    valid = true;
  }
  if (verifiedByHost) {
    valid = true;
    [IP] = ALLOWED_IPS;
  }
  if (!valid) {
    return reply.code(200).send({ err: "Invalid Request/ Unauthorized" });
  }
  let tracking = await fetchTrackingService(trackingIds, clientOrderIds, authToken, IP);
  if (
    !isEmpty(tracking) &&
    (("err" in tracking && !tracking.err && tracking) ||
      "response_list" in tracking ||
      !("err" in tracking))
  ) {
    tracking = await prepareTrackingRes(tracking);
  }
  if (isEmpty(tracking)) {
    if (clientOrderIds) {
      return reply.code(200).send({ responseList: [] });
    }
    if (trackingIds) {
      return reply.code(200).send({ err: "Tracking Id Not Found" });
    }
  }
  return reply.code(200).send(tracking);
};

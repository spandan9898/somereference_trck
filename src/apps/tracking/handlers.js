/* eslint-disable import/no-unresolved */

const RequestIp = require("@supercharge/request-ip");
const { isEmpty } = require("lodash");
const logger = require("../../../logger");
const {
  prepareTrackingRes,
  prepareClientTracking,
  preparePublicTracking,
} = require("./preparator");
const { fetchTrackingService, TrackingAuthenticationService } = require("./services");

module.exports.publicTracking = async (req, reply) => {
  const trackingAuth = await TrackingAuthenticationService(req);
  if ("err" in trackingAuth) {
    return reply.code(200).send(trackingAuth);
  }
  if ("status" in trackingAuth) {
    return reply.code(200).send(trackingAuth);
  }
  const clientOrderIds = trackingAuth?.clientOrderIds;
  const trackingIds = trackingAuth?.trackingIds;
  const authToken = trackingAuth?.authToken;
  const IP = trackingAuth?.IP;

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
      return reply.code(200).send({ response_list: [] });
    }
    if (trackingIds) {
      return reply.code(200).send({ err: "Tracking ID Not Found" });
    }
  }
  tracking = await preparePublicTracking(tracking);
  return reply.code(200).send(tracking);
};

module.exports.clientTracking = async (req, reply) => {
  try {
    const trackingAuth = await TrackingAuthenticationService(req);
    if ("err" in trackingAuth) {
      return reply.code(200).send(trackingAuth);
    }
    if ("status" in trackingAuth) {
      return reply.code(200).send(trackingAuth);
    }
    const clientOrderIds = trackingAuth?.clientOrderIds;
    const trackingIds = trackingAuth?.trackingIds;
    const authToken = trackingAuth?.authToken;
    const IP = trackingAuth?.IP;
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
        return reply.code(200).send({ response_list: [] });
      }
      if (trackingIds) {
        return reply.code(200).send({ err: "Tracking ID Not Found" });
      }
    }
    tracking = await prepareClientTracking(tracking);
    return reply.code(200).send(tracking);
  } catch (error) {
    logger.error("client tracking handler error", error);
    return reply.code(200).send(error.message);
  }
};

module.exports.returnHeaders = async (req, reply) => {
  const IP = RequestIp.getClientIp(req);
  const replydict = {
    IP,
    headers: req.headers,
  };
  return reply.code(200).send(replydict);
};

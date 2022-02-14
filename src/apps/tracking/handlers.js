/* eslint-disable import/no-unresolved */

const { isEmpty } = require("lodash");
const {
  prepareTrackingRes,
  prepareClientTracking,
  preparePublicTracking,
} = require("./preparator");
const {
  fetchTrackingService,
  TrackingAuthenticationService,
  getTrackingIdFromClientOrderIdClientTrackingService,
  getTrackingIdFromClientOrderIdPublicTrackingService,
  updateClientOrderIdPatternInCacheService,
  authenticateUpdateClientOrderIdInCache,
} = require("./services");

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

  let trackingIdsList = [];
  if (clientOrderIds) {
    trackingIdsList = await getTrackingIdFromClientOrderIdPublicTrackingService(clientOrderIds);
  } else if (trackingIds) {
    trackingIdsList = trackingIds.replaceAll(" ", "").split(",");
  } else {
    return reply.code(200).send({ response_list: [] });
  }

  let tracking = await fetchTrackingService(trackingIdsList, authToken, IP);
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

    let trackingIdsList = [];
    if (clientOrderIds) {
      trackingIdsList = await getTrackingIdFromClientOrderIdClientTrackingService(
        clientOrderIds,
        authToken
      );
    } else if (trackingIds) {
      trackingIdsList = trackingIds.replaceAll(" ", "").split(",");
    } else {
      return reply.code(200).send({ response_list: [] });
    }
    let tracking = await fetchTrackingService(trackingIdsList, authToken, IP);
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
    return reply.code(200).send(error.message);
  }
};

module.exports.updateClientOrderIdCache = async (req, reply) => {
  try {
    const updateCacheAuthentication = await authenticateUpdateClientOrderIdInCache(req);
    const clientOrderIdsList = updateCacheAuthentication?.clientOrderIdsList;
    const authToken = updateCacheAuthentication?.authToken;
    const userPK = Number(updateCacheAuthentication?.userPK);
    const res = await updateClientOrderIdPatternInCacheService({
      clientOrderIdsList,
      authToken,
      userPK,
    });
    return reply.code(200).send(res);
  } catch (error) {
    return reply.code(200).send(error.message);
  }
};

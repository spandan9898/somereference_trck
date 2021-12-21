// const { BLOCKED_IPS, ALLOWED_IPS } = require("./constant");

const { fetchTrackingService } = require("./services");

module.exports.track = async (req) => {
  //   const ip = null;
  //   const verifyByHost = false;

  let trackingIds = null;
  let clientOrderIds = null;

  console.log("handlers");

  //   try {
  //     ip = req.Meta.get("REMOTE_ADDR");
  //     if (ip in BLOCKED_IPS) {
  //       const response = { status: "" };
  //       return response;
  //     }
  //   } catch (error) {
  //     console.log("No REMOTE _ADDR key");
  //   }

  //   try {
  //     const hostName = req.Meta.HTTP_POST;
  //     const s = "pickrr.com";
  //     verifyByHost = false;
  //     if (hostName.includes(s)) {
  //       verifyByHost = true;
  //     }
  //   } catch (error) {
  //     //
  //   }

  const { query } = req;
  console.log(query);
  if (query.tracking_id) {
    trackingIds = query.tracking_id
      .replace("\n", "")
      .replace("\t", "")
      .replace("\r", "")
      .replace(" ", "");
  } else if (query.client_order_id) {
    clientOrderIds = query.client_order_id
      .replace("\n", "")
      .replace("\t", "")
      .replace("\r", "")
      .replace(" ", "");
  } else {
    return { err: "Invalid Request" };
  }
  console.log("tracking-id -->", trackingIds);

  //   let authToken = null;
  //   if (params.auth_token) {
  //     authToken = params.auth_token;
  //   }

  //   let valid = true;
  //   if (!authToken) {
  //     valid = false;
  //   }

  //   if (verifyByHost) {
  //     valid = true;
  //     [ip] = ALLOWED_IPS;
  //   }

  //   if (!valid) {
  //     return { err: "Invalid Request/Unauthaorized" };
  //   }

  //   const tracking = await fetchTrackingService(trackingIds, clientOrderIds, authToken, ip);

  // eslint-disable-next-line prefer-const
  let tracking = await fetchTrackingService(trackingIds, clientOrderIds);

  // if (
  //   (tracking.err && !tracking && tracking.err != null) ||
  //   (tracking.response_list || tracking.err) === false
  // ) {
  //   tracking = filterTrackingParams(tracking);
  // }

  return tracking;
};

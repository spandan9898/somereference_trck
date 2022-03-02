/**
 *
 * @param {*} trackingObj
 * @desc get current status based on some conditions
 * @returns
 */
const getCurrentTrackStatus = (trackingObj) => {
  let currentStatus = null;
  switch (true) {
    case trackingObj.returnDeliveredDate: // TODO: confirm from where we will get this
      currentStatus = "RTD";
      break;
    case trackingObj.rtoDate:
      currentStatus = "RTO";
      break;
    case trackingObj.deliveryDate:
      currentStatus = "DL";
      break;
    case trackingObj.outDeliveryTime:
      currentStatus = "OO";
      break;
    case trackingObj.inTransitTime:
      currentStatus = "OT";
      break;
    case trackingObj.pickupTime:
      currentStatus = "PP";
      break;
    case trackingObj.isCancelled:
      currentStatus = "OC";
      break;
    case trackingObj.manifestTime || trackingObj.placedAt:
      currentStatus = "OP";
      break;
    default: {
      break;
    }
  }
  return currentStatus;
};

/**
 *
 * @param {*} trackingObj
 */
const getWoocomClientStatus = (trackingObj) => {
  const clientWoocomObj = trackingObj.woocomPlatform; // TODO
  const currentStatus = getCurrentTrackStatus(trackingObj);
  let clientStatus = null;

  switch (true) {
    case currentStatus === "PP" && clientWoocomObj.picked_up:
      clientStatus = clientWoocomObj.picked_up;
      break;
    case currentStatus === "OT" && clientWoocomObj.transit:
      clientStatus = clientWoocomObj.transit;
      break;
    case currentStatus === "RTO" && clientWoocomObj.rto:
      clientStatus = clientWoocomObj.rto;
      break;
    case currentStatus === "OC" && clientWoocomObj.cancelled:
      clientStatus = clientWoocomObj.cancelled;
      break;
    case currentStatus === "DL" && clientWoocomObj.delivered:
      clientStatus = clientWoocomObj.delivered;
      break;
    case currentStatus === "RTD" && clientWoocomObj.rtd:
      clientStatus = clientWoocomObj.rtd;
      break;
    case currentStatus === "OP" && clientWoocomObj.order_placed:
      clientStatus = clientWoocomObj.order_placed;
      break;
    default:
      clientStatus = null;
      break;
  }
  return clientStatus;
};

module.exports = {
  getCurrentTrackStatus,
  getWoocomClientStatus,
};

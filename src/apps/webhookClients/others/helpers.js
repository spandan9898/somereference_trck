const getCurrentTrackStatus = (trackingObj) => {
    currentStatus = None
    if (trackingObj.returnDeliveredDate)
        currentStatus = 'RTD';
    else if (trackingObj.rtoDate)
        currentStatus = 'RTO';
    else if (trackingObj.deliveryDate)
        currentStatus = 'DL';
    else if (trackingObj.outDeliveryTime)
        currentStatus = 'OO';
    else if (trackingObj.inTransitTime)
        currentStatus = 'OT';
    else if (trackingObj.pickupTime)
        currentStatus = 'PP';
    else if (trackingObj.order.isCancelled)
        currentStatus = 'OC';
    else if (trackingObj.manifestTime || trackingObj.order.placedAt)
        currentStatus = 'OP';
    else {
        pass;
    }
    return currentStatus
};

module.exports = {
    getCurrentTrackStatus
}
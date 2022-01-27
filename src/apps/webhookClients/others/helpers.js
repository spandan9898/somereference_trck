const getCurrentTrackStatus = (trackingObj) => {
    currentStatus = None
    switch (true) {
        case (trackingObj.returnDeliveredDate !== null):
            currentStatus = 'RTD';
            break;
        case (trackingObj.rtoDate !== null):
            currentStatus = 'RTO';
            break;
        case (trackingObj.deliveryDate !== null):
            currentStatus = 'DL';
            break;
        case (trackingObj.outDeliveryTime !== null):
            currentStatus = 'OO';
            break;
        case (trackingObj.inTransitTime !== null):
            currentStatus = 'OT';
            break;
        case (trackingObj.pickupTime !== null):
            currentStatus = 'PP';
            break;
        case (trackingObj.isCancelled !== null):
            currentStatus = 'OC';
            break;
        case (trackingObj.manifestTime !== null || trackingObj.order.placedAt !== null):
            currentStatus = 'OP';
            break;
        default: {
            break;
        }
    }
    return currentStatus;

};

module.exports = {
    getCurrentTrackStatus
}
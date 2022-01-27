

const getCurrentTrackStatus = (trackingObj) => {
    current_status = None
    if (trackingObj.return_delivered_date)
        current_status = 'RTD';
    else if (trackingObj.rto_date)
        current_status = 'RTO';
    else if (trackingObj.delivery_date)
        current_status = 'DL';
    else if (trackingObj.out_delivery_time)
        current_status = 'OO';
    else if (trackingObj.in_transit_time)
        current_status = 'OT';
    else if (trackingObj.pickup_time)
        current_status = 'PP';
    else if (trackingObj.order.is_cancelled)
        current_status = 'OC';
    else if (trackingObj.manifest_time || trackingObj.order.placed_at)
        current_status = 'OP';
    else {
        pass;
    }
    return current_status
};

module.exports = {
    getCurrentTrackStatus
}
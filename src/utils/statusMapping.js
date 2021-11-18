const PICKRR_STATUS_CODE_MAPPING = {
  OP: "Order Placed",
  OM: "Order Manifested",
  OC: "Order Cancelled",
  PP: "Order Picked Up",
  OD: "Order Dispatched",
  OT: "Order in Transit",
  OO: "Order Out for Delivery",
  NDR: "Failed Attempt at Delivery",
  DL: "Order Delivered",
  RTO: "Order Returned Back",
  "RTO-OT": "RTO in Transit",
  "RTO-OO": "RTO out for delivery",
  RTP: "RTO Reached Pickrr Warehouse",
  RTD: "Order Returned to Consignee",
  OFP: "Out for pickup",
  PPF: "Pickup Failed",
  SHP: "Shipped",
  RAD: "Reached at Destination",
  LT: "Shipment Lost",
  DM: "Shipment Damaged",
  "RTO UD": "RTO Undelivered",
  UD: "Undelivered",
};

module.exports = {
  PICKRR_STATUS_CODE_MAPPING,
};

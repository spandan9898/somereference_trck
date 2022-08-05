const SHOPCLUES_STATUS_CODE_TO_STATUS_MAPS = {
  CR: "Customer Refused Shipment",
  CNA: "Customer Not Available/Office/Residence Closed/Consignee phone not reachable",
  AI: "Address Issue",
  "CR-OTP": "Customer Refused Shipment- OTP Verified",
  ODA: "Out of Delivery area",
  CD: "Customer Delay/Future Delivery",
  CNR: "Cash Not Ready",
  OPDEL: "Conignee wants open delivery",
};

const SHOPCLUES_STATUS_DESCRIPTION_MAPPING = {
  PP: "Shipped",
  DL: "Delivered",
  RTO: "Return To Origin",
  RTD: "RTO Delivered to Merchant",
  CR: "Delivery Attempted - Customer Refused To Accept Delivery",
  CNA: "Delivery Attempted - Customer Not Available/Contactable",
  AI: "Delivery Attempted - Address Issue/Wrong Address",
  "CR-OTP": "Delivery Attempted - Customer Refused To Accept Delivery",
  ODA: "ODA not Delivered",
  CD: "Delivery Attempted - Requested for Future Delivery",
  CNR: "Delivery Attempted - COD Not ready",
  OPDEL: "Delivery Attempted - Requested For Open Delivery",
  OT: "Shipped",
  NDR: "Undelivered- Other Reasons",
  QCF: "QC Failed",
};

const SHOPCLUES_STATUS_MAPPING = {
  OP: "Order Placed",
  OM: "Order Manifested",
  OC: "Order Cancelled",
  PP: "Order Picked Up",
  OT: "Order in Transit",
  OO: "Order Out for Delivery",
  DL: "Order Delivered",
  RTO: "Order Returned Back",
  "RTO-OT": "RTO in Transit",
  "RTO-OO": "RTO Out for Delivery",
  RTP: "RTO Reached Pickrr Warehouse",
  RTD: "Order Returned to Seller",
  OFP: "Out for pickup",
  PPF: "Pickup Failed",
  SHP: "Shipped",
  RAD: "Reached at Destination",
  LT: "Shipment Lost",
  DM: "Shipment Damaged",
  "RTO UD": "RTO Undelivered",
  NDR: {
    "Failed Attempt at Delivery": "NDR",
    "Customer Refused Shipment": "CR",
    "Customer Not Available": "CNA",
    Office: "CNA",
    "Residence Closed": "CNA",
    "Consignee phone not reachable": "CNA",
    "Address Issue": "AI",
    "Customer Delay": "CD",
    "Future Delivery": "CD",
    "Entry Restricted Area": "REST",
    "Customer Refused Shipment- OTP Verified": "CR-OTP",
    "Out of Delivery area": "ODA",
    "Cash Not Ready": "CNR",
    "Conignee wants open delivery": "OPDEL",
    Other: "OTH",
    "Customer Issue": "CI",
    "Shipper Delay": "SD",
  },
  QCF: "QC Failed",
};

const SHOPCLUES_PUSH_URL = "http://developer.shopclues.com/api/v2/app/Pushordertrack/pushScan";

const SHOPCLUES_PUSH_TESTING_URL =
  "http://sandbox.shopclues.com/api/v2/app/Pushordertrack/pushScan";

module.exports = {
  SHOPCLUES_STATUS_CODE_TO_STATUS_MAPS,
  SHOPCLUES_STATUS_DESCRIPTION_MAPPING,
  SHOPCLUES_STATUS_MAPPING,
  SHOPCLUES_PUSH_URL,
  SHOPCLUES_PUSH_TESTING_URL,
};

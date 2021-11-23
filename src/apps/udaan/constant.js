const UDAAN_STATUS_MAPPING = {
  FW_PICKUP_CREATED: { scan_type: "OM", pickrr_sub_status_code: "" },
  FW_OUT_FOR_PICKUP: { scan_type: "OFP", pickrr_sub_status_code: "" },
  FW_PICKED_UP: { scan_type: "PP", pickrr_sub_status_code: "" },
  "FW_PICKUP_FAILED_Seller Not Attempted - Vehicle Breakdown/Traffic": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "FW_PICKUP_FAILED_Seller Not Attempted - Vehicle full": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "FW_PICKUP_FAILED_Seller Not Attempted - No Entry Restriction": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "FW_PICKUP_FAILED_Pickup Attempted - Address not found. Seller not contactable": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  "FW_PICKUP_FAILED_Seller Not Attempted - Shortage of time": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "FW_PICKUP_FAILED_Seller Not Attempted - Tech Issue": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  "FW_PICKUP_FAILED_Attempted - Shop Closed": { scan_type: "PPF", pickrr_sub_status_code: "SC" },
  "FW_PICKUP_FAILED_Attempted - Order not packed": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "FW_PICKUP_FAILED_Attempted - Vehicle full": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "FW_PICKUP_FAILED_Attempted - Poor Packaging": {
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  "FW_PICKUP_FAILED_Attempted - Tech Issue": { scan_type: "PPF", pickrr_sub_status_code: "REJ" },
  "FW_PICKUP_FAILED_Attempted - Packet Id not matching": {
    scan_type: "PPF",
    pickrr_sub_status_code: "REJ",
  },
  "FW_PICKUP_FAILED_Attempted - Closed due to COVID Impact": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  "FW_PICKUP_FAILED_Seller not attempted - Closed due to COVID Impact": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  FW_PICKED_NOT_VERIFIED: { scan_type: "PP", pickrr_sub_status_code: "" },
  FW_HUB_INSCAN: { scan_type: "SHP", pickrr_sub_status_code: "" },
  FW_HUB_OUTSCAN: { scan_type: "OT", pickrr_sub_status_code: "" },
  FW_RAD: { scan_type: "RAD", pickrr_sub_status_code: "" },
  FW_OUT_FOR_DELIVERY: { scan_type: "OO", pickrr_sub_status_code: "" },
  "FW_DELIVERY_ATTEMPTED_Market Shut - Covid Virus": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "FW_DELIVERY_ATTEMPTED_Buyer not reachable over phone": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "FW_DELIVERY_ATTEMPTED_Buyer not available/Shop closed/Out of station": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "FW_DELIVERY_ATTEMPTED_Cash not ready": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "FW_DELIVERY_ATTEMPTED_Address not found": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "FW_DELIVERY_ATTEMPTED_Open delivery": { scan_type: "UD", pickrr_sub_status_code: "OPDEL" },
  "FW_DELIVERY_ATTEMPTED_Buyer rejected - shipment tampered": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "FW_DELIVERY_ATTEMPTED_Shipment RTO": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "FW_DELIVERY_ATTEMPTED_Buyer expecting Credit order/ GST or Invoice issue": {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "FW_DELIVERY_ATTEMPTED_Issue with previous order/ RVP": {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "FW_DELIVERY_ATTEMPTED_Buyer refused to sign PoD/ Runsheet": {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "FW_DELIVERY_ATTEMPTED_Incorrect Pincode": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "FW_DELIVERY_ATTEMPTED_Delivery charge issue": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  CANCELLED: { scan_type: "OC", pickrr_sub_status_code: "" },
  FW_DELIVERED: { scan_type: "DL", pickrr_sub_status_code: "" },
  RT_RTO_MARKED: { scan_type: "RTO", pickrr_sub_status_code: "" },
  RTO_MARKED: { scan_type: "RTO", pickrr_sub_status_code: "" },
  RT_HUB_INSCAN: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  RT_HUB_OUTSCAN: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  RT_RAD: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  RT_OUT_FOR_DELIVERY: { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  RT_DELIVERED: { scan_type: "RTD", pickrr_sub_status_code: "" },
};

const { UDAAN_TOPICS_COUNT } = 2;

module.exports = {
  UDAAN_STATUS_MAPPING,
  UDAAN_TOPICS_COUNT,
};

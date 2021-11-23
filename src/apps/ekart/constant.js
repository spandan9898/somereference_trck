const EKART_STATUS_MAPPER = {
  shipment_created: { scan_type: "OP", pickrr_sub_status_code: "" },
  shipment_pickup_complete: { scan_type: "PP", pickrr_sub_status_code: "" },
  pickup_cancelled: { scan_type: "PPF", pickrr_sub_status_code: "CANC" },
  shipment_received: { scan_type: "SHP", pickrr_sub_status_code: "" },
  shipment_in_transit: { scan_type: "OT", pickrr_sub_status_code: "" },
  shipment_out_for_delivery: { scan_type: "OO", pickrr_sub_status_code: "" },
  shipment_delivered: { scan_type: "DL", pickrr_sub_status_code: "" },
  "shipment_undelivered_unattempted_Heavy Load": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "shipment_undelivered_unattempted_Vehicle Breakdown": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "shipment_undelivered_unattempted_Security Instability": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "shipment_undelivered_unattempted_Heavy Traffic": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "shipment_undelivered_unattempted_Heavy Rain": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  shipment_undelivered_unattempted_Holiday: { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "shipment_undelivered_attempted_Incomplete Address": {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "shipment_undelivered_attempted_COD Not Ready": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "shipment_undelivered_attempted_Door Lock": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "shipment_undelivered_attempted_Customer Not Available": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "shipment_undelivered_attempted_Request for reschedule. delivery_date changed to:<new date>": {
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "shipment_undelivered_attempted_Rejected OpenDelivery": {
    scan_type: "UD",
    pickrr_sub_status_code: "OPDEL",
  },
  "shipment_undelivered_attempted_Customer Not Responding": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  shipment_undelivered_attempted_Rejected: { scan_type: "UD", pickrr_sub_status_code: "CR" },
  shipment_misrouted: { scan_type: "OT", pickrr_sub_status_code: "" },
  shipment_rto_created_Damaged_shipment: { scan_type: "DM", pickrr_sub_status_code: "" },
  shipment_rto_created_Rejected_by_Customer: { scan_type: "UD", pickrr_sub_status_code: "CR" },
  shipment_rto_created_non_serviceable: { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "shipment_rto_created_Did not place order": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "shipment_rto_created_Do not want the product": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  shipment_rto_created_Customer_Cancellation: { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "shipment_rto_created_Client-Cancellation": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  shipment_rto_created_Attempts_Exhausted: { scan_type: "UD", pickrr_sub_status_code: "CI" },
  shipment_rto_created_ShipmentIntransitByondLimit: {
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  shipment_rto_created_order_cancelled: { scan_type: "UD", pickrr_sub_status_code: "CI" },
  shipment_rto_created_Incomplete_Address: { scan_type: "UD", pickrr_sub_status_code: "AI" },
  shipment_rto_created_RFRPromiseBreached: { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "shipment_rto_created_Unavailable at Delivery Address": {
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "shipment_rto_created_Purchased by mistake": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  shipment_rto_created_Rejected_by_Customer_PostOBD: {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  shipment_rto_confirmed: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  shipment_rto_in_transit: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  shipment_rto_completed: { scan_type: "RTD", pickrr_sub_status_code: "" },
  "shipment_rto_cancelled_shipment is delivered": { scan_type: "DL", pickrr_sub_status_code: "" },
};

const { EKART_TOPICS_COUNT } = 1;
module.exports = {
  EKART_STATUS_MAPPER,
  EKART_TOPICS_COUNT,
};

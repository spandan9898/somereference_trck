const EKART_STATUS_MAPPER = {
  shipment_created: { scan_type: "OP", pickrr_sub_status_code: "" },
  shipment_pickup_complete: { scan_type: "PP", pickrr_sub_status_code: "" },
  pickup_cancelled: { scan_type: "OC", pickrr_sub_status_code: "" },
  shipment_received: { scan_type: "SHP", pickrr_sub_status_code: "" },
  shipment_in_transit: { scan_type: "OT", pickrr_sub_status_code: "" },
  shipment_out_for_delivery: { scan_type: "OO", pickrr_sub_status_code: "" },
  shipment_delivered: { scan_type: "DL", pickrr_sub_status_code: "" },
  "shipment_undelivered_unattempted_heavy load": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "shipment_undelivered_unattempted_vehicle breakdown": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "shipment_undelivered_unattempted_security instability": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "shipment_undelivered_unattempted_heavy traffic": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "shipment_undelivered_unattempted_heavy rain": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  shipment_undelivered_unattempted_holiday: { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "shipment_undelivered_attempted_incomplete address": {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "shipment_undelivered_attempted_cod not ready": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "shipment_undelivered_attempted_door lock": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "shipment_undelivered_attempted_customer not available": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "shipment_undelivered_attempted_request for reschedule. delivery_date changed to:<new date>": {
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "shipment_undelivered_attempted_rejected opendelivery": {
    scan_type: "UD",
    pickrr_sub_status_code: "OPDEL",
  },
  "shipment_undelivered_attempted_customer not responding": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  shipment_undelivered_attempted_rejected: { scan_type: "UD", pickrr_sub_status_code: "CR" },
  shipment_misrouted: { scan_type: "OT", pickrr_sub_status_code: "" },
  shipment_rto_created_damaged_shipment: { scan_type: "DM", pickrr_sub_status_code: "" },
  shipment_rto_created_rejected_by_customer: {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  shipment_rto_created_non_serviceable: { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "shipment_rto_created_did not place order": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "shipment_rto_created_do not want the product": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  shipment_rto_created_customer_cancellation: {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "shipment_rto_created_client-cancellation": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  shipment_rto_created_attempts_exhausted: { scan_type: "UD", pickrr_sub_status_code: "CI" },
  shipment_rto_created_shipmentintransitbyondlimit: {
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  shipment_rto_created_order_cancelled: { scan_type: "UD", pickrr_sub_status_code: "CI" },
  shipment_rto_created_incomplete_address: { scan_type: "UD", pickrr_sub_status_code: "AI" },
  shipment_rto_created_rfrpromisebreached: { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "shipment_rto_created_unavailable at delivery address": {
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "shipment_rto_created_purchased by mistake": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  shipment_rto_created_rejected_by_customer_postobd: {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  shipment_rto_confirmed: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  shipment_rto_in_transit: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  shipment_rto_completed: { scan_type: "RTD", pickrr_sub_status_code: "" },
  "shipment_rto_cancelled_shipment is delivered": {
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
};

const EKART_TOPICS_COUNT = 3;
const PARTITION_COUNT = 10;
const PUSH_GROUP_NAME = "ekart-push-group";
const PUSH_TOPIC_NAME = "ekart_push";

module.exports = {
  EKART_STATUS_MAPPER,
  EKART_TOPICS_COUNT,
  PARTITION_COUNT,
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
};

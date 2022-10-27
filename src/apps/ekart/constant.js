const EKART_STATUS_MAPPER = {
  shipment_created: { scan_type: "OP", pickrr_sub_status_code: "" },
  shipment_pickup_complete: { scan_type: "PP", pickrr_sub_status_code: "" },
  pickup_cancelled: { scan_type: "PPF", pickrr_sub_status_code: "CANC" },
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
  shipment_rto_created_damaged_shipment: { scan_type: "RTO", pickrr_sub_status_code: "" },
  shipment_rto_created_rejected_by_customer: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  shipment_rto_created_non_serviceable: { scan_type: "RTO", pickrr_sub_status_code: "" },
  "shipment_rto_created_did not place order": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "shipment_rto_created_do not want the product": {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  shipment_rto_created_customer_cancellation: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  "shipment_rto_created_client-cancellation": { scan_type: "RTO", pickrr_sub_status_code: "" },
  shipment_rto_created_attempts_exhausted: { scan_type: "RTO", pickrr_sub_status_code: "" },
  shipment_rto_created_shipmentintransitbyondlimit: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  shipment_rto_created_order_cancelled: { scan_type: "RTO", pickrr_sub_status_code: "" },
  shipment_rto_created_incomplete_address: { scan_type: "RTO", pickrr_sub_status_code: "" },
  shipment_rto_created_rfrpromisebreached: { scan_type: "RTO", pickrr_sub_status_code: "" },
  "shipment_rto_created_unavailable at delivery address": {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  "shipment_rto_created_purchased by mistake": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  shipment_rto_created_rejected_by_customer_postobd: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  shipment_rto_created: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  shipment_rto_confirmed: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  shipment_rto_in_transit: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  shipment_rto_completed: { scan_type: "RTD", pickrr_sub_status_code: "" },
  "shipment_rto_cancelled_shipment is delivered": {
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  received_at_dh: { scan_type: "RAD", pickrr_sub_status_code: "" },
  shipment_rto_created_other_city_misroute: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  shipment_rto_undelivered_pickup_time_elapsed: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  pickup_out_for_pickup: {
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  shipment_shipped: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  received: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  expected: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  return_out_for_delivery: {
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  shipment_lost: {
    scan_type: "LT",
    pickrr_sub_status_code: "",
  },
  return_received: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  return_expected: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  return_received_at_dh: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "return_undelivered_attempted_heavy load": {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "SD",
  },
  "return_undelivered_attempted_vehicle breakdown": {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "SD",
  },
  "return_undelivered_attempted_security instability": {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "SD",
  },
  "return_undelivered_attempted_heavy traffic": {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "SD",
  },
  "return_undelivered_attempted_heavy rain": {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "SD",
  },
  return_undelivered_attempted_holiday: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "SD",
  },
  return_delivered: {
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  "return_rejected_by_seller_ekl:force rejected by seller": {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "OTH",
  },
  return_lost: {
    scan_type: "LT",
    pickrr_sub_status_code: "",
  },

  // matching event_subreason_reason

  "pickup_not_picked_unattempted_customernotavailable_ekl related": {
    scan_type: "PPF",
    pickrr_sub_status_code: "CNA",
  },
  "pickup_not_picked_attempted_productmismatch_customer related": {
    qc: {
      scan_type: "QCF",
      pickrr_sub_status_code: ":PMM",
    },
    non_qc: {
      scan_type: "PPF",
      pickrr_sub_status_code: "R-PMM",
    },
  },
  "pickup_not_picked_attempted_customerhappywithproduct_customer related": {
    qc: {
      scan_type: "QCF",
      pickrr_sub_status_code: "OCC",
    },
    non_qc: {
      scan_type: "PPF",
      pickrr_sub_status_code: "R-CANC",
    },
  },
  pickup_not_picked_unattempted_customernotavailable: {
    qc: {
      scan_type: "PPF",
      pickrr_sub_status_code: "CNA",
    },
    non_qc: {
      scan_type: "PPF",
      pickrr_sub_status_code: "CNA",
    },
  },
};
const EKART_PULL_MAPPER = {
  shipment_created: {
    courier_remarks: "Shipment created successfully in system.",
    courier_status: "shipment_created",
    courier_status_type: "shipment_created",
    pickrr_code: "OP",
    pickrr_sub_status_code: "",
    pickrr_status: "Order Placed",
    pickrr_sub_status: "",
  },
  pickup_scheduled: {
    courier_remarks:
      "Pickup from seller location scheduled and expectancy created at ekl-marketplace",
    courier_status: "pickup_scheduled",
    courier_status_type: "pickup_scheduled",
    pickrr_code: "OM",
    pickrr_sub_status_code: "",
    pickrr_status: "Order Manifested",
    pickrr_sub_status: "",
  },
  out_for_pickup: {
    courier_remarks: "Shipment is out for pickup.",
    courier_status: "out_for_pickup",
    courier_status_type: "out_for_pickup",
    pickrr_code: "OFP",
    pickrr_sub_status_code: "",
    pickrr_status: "Out for pickup",
    pickrr_sub_status: "",
  },
  pickup_complete: {
    courier_remarks: "Shipment is picked from seller location.",
    courier_status: "pickup_complete",
    courier_status_type: "pickup_complete",
    pickrr_code: "PP",
    pickrr_sub_status_code: "",
    pickrr_status: "Order Picked Up",
    pickrr_sub_status: "",
  },
  pickup_reattempt: {
    courier_remarks: "Shipment pickup failed, reattempt pickup again.",
    courier_status: "pickup_reattempt",
    courier_status_type: "pickup_reattempt",
    pickrr_code: "PPF",
    pickrr_sub_status_code: "",
    pickrr_status: "Pickup Failed",
    pickrr_sub_status: "",
  },
  pickup_cancelled: {
    courier_remarks:
      "Shipment pickup cancelled, can be due to cancellation, number of pickup attempts exceeded minimum value, etc.",
    courier_status: "pickup_cancelled",
    courier_status_type: "pickup_cancelled",
    pickrr_code: "PPF",
    pickrr_sub_status_code: "CANC",
    pickrr_status: "Order Cancelled",
    pickrr_sub_status: "",
  },
  in_transit: {
    courier_remarks: "Expected/Recieved at MotherHub. Or in transit to a hub",
    courier_status: "in_transit",
    courier_status_type: "in_transit",
    pickrr_code: "OT",
    pickrr_sub_status_code: "",
    pickrr_status: "Order in Transit",
    pickrr_sub_status: "",
  },
  out_for_delivery: {
    courier_remarks: "Shipment is out for delivery.",
    courier_status: "out_for_delivery",
    courier_status_type: "out_for_delivery",
    pickrr_code: "OO",
    pickrr_sub_status_code: "",
    pickrr_status: "Order Out for Delivery",
    pickrr_sub_status: "",
  },
  undelivered: {
    courier_remarks:
      "Shipment was undelivered, can be due to- delivery attempted and failed, delivery not attempted, shipment got damaged, heavy load, vehivle breakdown, heavy traffic, heavy rain, door was locked, holiday, etc.",
    courier_status: "undelivered",
    courier_status_type: "undelivered",
    pickrr_code: "UD",
    pickrr_sub_status_code: "SD",
    pickrr_status: "Failed Attempt at Delivery",
    pickrr_sub_status: "Shipper Delay",
  },
  unsuccessful_delivery_attempt_due_to_address_issues: {
    courier_remarks:
      "Shipment delivery attempt unsuccessful due to incomplete customer address or provided address not found.",
    courier_status: "unsuccessful_delivery_attempt_due_to_address_issues",
    courier_status_type: "unsuccessful_delivery_attempt_due_to_address_issues",
    pickrr_code: "UD",
    pickrr_sub_status_code: "AI",
    pickrr_status: "Failed Attempt at Delivery",
    pickrr_sub_status: "Address Issue",
  },
  undelivered_due_to_rejection_by_customer: {
    courier_remarks: "Shipment delivery failed due to customer rejection.",
    courier_status: "undelivered_due_to_rejection_by_customer",
    courier_status_type: "undelivered_due_to_rejection_by_customer",
    pickrr_code: "UD",
    pickrr_sub_status_code: "CR",
    pickrr_status: "Failed Attempt at Delivery",
    pickrr_sub_status: "Customer Refused Shipment",
  },
  undelivered_due_to_customer_unavailability: {
    courier_remarks:
      "Shipment undelivered due to customer unavailability or delivery reschedule requested by customer.",
    courier_status: "undelivered_due_to_customer_unavailability",
    courier_status_type: "undelivered_due_to_customer_unavailability",
    pickrr_code: "UD",
    pickrr_sub_status_code: "CNA",
    pickrr_status: "Failed Attempt at Delivery",
    pickrr_sub_status:
      "Customer Not Available/Office/Residence Closed/Consignee phone not reachable",
  },

  undelivered_due_to_cash_unavailability: {
    courier_remarks: "Shipment undelivered as COD not ready",
    courier_status: "undelivered_due_to_cash_unavailability",
    courier_status_type: "undelivered_due_to_cash_unavailability",
    pickrr_code: "UD",
    pickrr_sub_status_code: "CNR",
    pickrr_status: "Failed Attempt at Delivery",
    pickrr_sub_status: "Cash Not Ready",
  },
  unsuccessful_delivery_attempt_due_to_serviceability_issues: {
    courier_remarks: "Shipment undelivered due to non serviceable pincode",
    courier_status: "unsuccessful_delivery_attempt_due_to_serviceability_issues",
    courier_status_type: "unsuccessful_delivery_attempt_due_to_serviceability_issues",
    pickrr_code: "UD",
    pickrr_sub_status_code: "ODA",
    pickrr_status: "Failed Attempt at Delivery",
    pickrr_sub_status: "Out of Delivery area",
  },
  undelivered_due_to_request_for_reschedule: {
    courier_remarks: "Undelivered. (Rescheduled to: __dd-mm-yy__)",
    courier_status: "undelivered_due_to_request_for_reschedule",
    courier_status_type: "undelivered_due_to_request_for_reschedule",
    pickrr_code: "UD",
    pickrr_sub_status_code: "CD",
    pickrr_status: "Failed Attempt at Delivery",
    pickrr_sub_status: "Customer Delay/Future Delivery",
  },
  delivered: {
    courier_remarks: "Shipment delivered",
    courier_status: "delivered",
    courier_status_type: "delivered",
    pickrr_code: "DL",
    pickrr_sub_status_code: "",
    pickrr_status: "Order Delivered",
    pickrr_sub_status: "",
  },
  lost: {
    courier_remarks: "Shipment got lost",
    courier_status: "lost",
    courier_status_type: "lost",
    pickrr_code: "LT",
    pickrr_sub_status_code: "",
    pickrr_status: "Shipment Lost",
    pickrr_sub_status: "",
  },
  untraceable: {
    courier_remarks: "Shipment untraceable",
    courier_status: "untraceable",
    courier_status_type: "untraceable",
    pickrr_code: "LT",
    pickrr_sub_status_code: "",
    pickrr_status: "Shipment Lost",
    pickrr_sub_status: "",
  },
  rto_created: {
    courier_remarks: "Shipment marked for Return To Origin",
    courier_status: "rto_created",
    courier_status_type: "rto_created",
    pickrr_code: "RTO",
    pickrr_sub_status_code: "",
    pickrr_status: "Order Returned Back",
    pickrr_sub_status: "",
  },
  rto_in_transit: {
    courier_remarks: "RTO shipment in transit",
    courier_status: "rto_in_transit",
    courier_status_type: "rto_in_transit",
    pickrr_code: "RTO-OT",
    pickrr_sub_status_code: "",
    pickrr_status: "RTO in Transit",
    pickrr_sub_status: "",
  },
  rto_completed: {
    courier_remarks: "RTO shipment received by merchant",
    courier_status: "rto_completed",
    courier_status_type: "rto_completed",
    pickrr_code: "RTD",
    pickrr_sub_status_code: "",
    pickrr_status: "Order Returned to Consignee",
    pickrr_sub_status: "",
  },
  rto_cancelled: {
    courier_remarks: "RTO marked cancelled",
    courier_status: "rto_cancelled",
    courier_status_type: "rto_cancelled",
    pickrr_code: "RTO UD",
    pickrr_sub_status_code: "",
    pickrr_status: "RTO Undelivered",
    pickrr_sub_status: "",
  },
  damaged: {
    courier_remarks: "Shipment damaged",
    courier_status: "damaged",
    courier_status_type: "damaged",
    pickrr_code: "DM",
    pickrr_sub_status_code: "",
    pickrr_status: "Shipment Damaged",
    pickrr_sub_status: "",
  },
  rto_received: {
    courier_remarks: "Marked_As_RTO",
    courier_status: "rto_received",
    courier_status_type: "rto_received",
    pickrr_code: "RTO",
    pickrr_sub_status_code: "",
    pickrr_status: "Order Returned Back",
    pickrr_sub_status: "",
  },
};

const EKART_UD_REASON = {
  CR: "Undelivered - Customer Refused Shipment",
  CNA: "Undelivered - Customer Not Available",
  AI: "Undelivered - Address Issue",
  CD: "Undelivered - Customer Delay",
  REST: "Undelivered - Restricted Area",
  "CR-OTP": "Undelivered - Customer Refused Shipment- OTP Verified",
  ODA: "Undelivered - Out of Delivery area",
  CNR: "Undelivered - Cash Not Ready",
  OPDEL: "Undelivered - Consignee wants open delivery",
  OTH: "Undelivered",
  CI: "Undelivered - Customer Issue",
  SD: "Undelivered - Shipper Delay",
  OTPF: "Undelivered - OTP Validation Failed",
};

const UD_TO_OT_HUB_NOTES = ["marked_as_same_state_misroute", "marked_as_other_state_misroute"];
const UD_TO_DM_HUB_NOTES = ["marked_as_received_damaged"];

const PUSH_PARTITION_COUNT = 10;
const PUSH_GROUP_NAME = "ekart-push-group";
const PUSH_TOPIC_NAME = "ekart_push";
const PULL_GROUP_NAME = "ekart-pull-group";
const PULL_TOPIC_NAME = "ekart_pull";
const PULL_PARTITION_COUNT = 10;

module.exports = {
  EKART_STATUS_MAPPER,
  EKART_PULL_MAPPER,
  EKART_UD_REASON,
  UD_TO_OT_HUB_NOTES,
  UD_TO_DM_HUB_NOTES,
  PUSH_PARTITION_COUNT,
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
  PULL_GROUP_NAME,
  PULL_TOPIC_NAME,
  PULL_PARTITION_COUNT,
};

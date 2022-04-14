const AMAZE_CODE_MAPPER = {
  "soft data upload": { scan_type: "OP", pickrr_sub_status_code: "" },
  "in scan - hub": { scan_type: "PP", pickrr_sub_status_code: "" },
  "bag created for hub": { scan_type: "SHP", pickrr_sub_status_code: "" },
  "bag created for branch": { scan_type: "SHP", pickrr_sub_status_code: "" },
  "in transit to hub": { scan_type: "OT", pickrr_sub_status_code: "" },
  "in transit to branch": { scan_type: "OT", pickrr_sub_status_code: "" },
  "bag verified at hub": { scan_type: "OT", pickrr_sub_status_code: "" },
  "bag verified at branch": { scan_type: "OT", pickrr_sub_status_code: "" },
  "shipment received at hub": { scan_type: "RAD", pickrr_sub_status_code: "" },
  "shipment received at branch": { scan_type: "RAD", pickrr_sub_status_code: "" },
  "out for delivery": { scan_type: "OO", pickrr_sub_status_code: "" },
  "undelivered-cod not ready": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "undelivered-house locked": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "undelivered-customer asking for future delivery on yyyy-mm-dd": {
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "undelivered-out of delivery area": { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "undelivered-misroute": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "undelivered-address not located and customer not contactable": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "undelivered-customer forcibly open the shipment and refused to accept the delivery": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "undelivered-order cancelled by customer": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "undelivered-vehicle breakdown could not attempt": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "undelivered-cod amount mismatch": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "undelivered-address pincode mismatch": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "undelivered-shipment lost": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "undelivered-incomplete address": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "undelivered-customer not contactable": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "undelivered-order cancelled by client": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  delivered: { scan_type: "DL", pickrr_sub_status_code: "" },
  "process to be rto": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "rto initiated": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "rto - pending to transit": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "rto - transit to hub": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "rto - received by hub": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "rto ofd": { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  "rto undelivered": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "rto delivered": { scan_type: "RTD", pickrr_sub_status_code: "" },
};

const PUSH_PARTITION_COUNT = 10;
const PUSH_GROUP_NAME = "amaze-push-group";
const PUSH_TOPIC_NAME = "amaze_push";

module.exports = {
  AMAZE_CODE_MAPPER,
  PUSH_PARTITION_COUNT,
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
};

const PUSH_PARTITION_COUNT = 10;
const PUSH_TOPIC_NAME = "pidge_push";
const PUSH_GROUP_NAME = "pidge-push-group";
const PULL_TOPIC_NAME = "pidge_pull";
const PULL_PARTITION_COUNT = 10;
const PULL_GROUP_NAME = "pidge_pull_group";

const PIDGE_CODE_MAPPER = {
  3: { scan_type: "OFP", pickrr_sub_status_code: "" },
  "13_cx unavailable": { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  "13_area unserviceable": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "13_dispatch unavailable": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "13_products/shipment not ready": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "13_wrong packaging": { scan_type: "PPF", pickrr_sub_status_code: "DAM" },
  "13_illegal items": { scan_type: "PPF", pickrr_sub_status_code: "REJ" },
  4: { scan_type: "OFP", pickrr_sub_status_code: "" },
  5: { scan_type: "OT", pickrr_sub_status_code: "" },
  10: { scan_type: "OO", pickrr_sub_status_code: "" },
  11: { scan_type: "DL", pickrr_sub_status_code: "" },
  "12_undelivered": { scan_type: "UD", pickrr_sub_status_code: "" },
  "12_address incorrect": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "12_blockade/unable to attempt": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "12_cod dispute - dtro": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "12_customer not available": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "12_customer reject order - drto": { scan_type: "UD", pickrr_sub_status_code: "CR-OTP" },
  "12_customer reschedule order": { scan_type: "UD", pickrr_sub_status_code: "CD" },
  "12_customer unreachable": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "12_failed delivery": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "12_not attempted - dtw": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "12_not attempted - pidge": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "12_requested by brand": { scan_type: "UD", pickrr_sub_status_code: "CI" },
  20: { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  22: { scan_type: "RTD", pickrr_sub_status_code: "" },
  "21_rto undelviered": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "21_cx unavailable": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "21_area unserviceable": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "21_cx reject rto": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "21_rto closed": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  40: { scan_type: "OT", pickrr_sub_status_code: "" },
  41: { scan_type: "OT", pickrr_sub_status_code: "" },
  "19_": { scan_type: "RTO", pickrr_sub_status_code: "" },
};

module.exports = {
  PUSH_PARTITION_COUNT,
  PIDGE_CODE_MAPPER,
  PUSH_TOPIC_NAME,
  PUSH_GROUP_NAME,
  PULL_GROUP_NAME,
  PULL_TOPIC_NAME,
  PULL_PARTITION_COUNT,
};

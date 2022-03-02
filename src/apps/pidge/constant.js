const PIDGE_PARTITION_COUNT = 10;
const PIDGE_TOPIC_COUNT = 1;
const PIDGE_CODE_MAPPER = {
  3: { scan_type: "OFP", pickrr_sub_status_code: "" },
  "13_CX Unavailable": { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  "13_Area Unserviceable": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "13_Dispatch Unavailable": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "13_Products/Shipment Not Ready": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "13_Wrong Packaging": { scan_type: "PPF", pickrr_sub_status_code: "DAM" },
  "13_Illegal Items": { scan_type: "PPF", pickrr_sub_status_code: "REJ" },
  4: { scan_type: "OFP", pickrr_sub_status_code: "" },
  5: { scan_type: "OT", pickrr_sub_status_code: "" },
  10: { scan_type: "OO", pickrr_sub_status_code: "" },
  11: { scan_type: "DL", pickrr_sub_status_code: "" },
  "12_Undelivered": { scan_type: "UD", pickrr_sub_status_code: "" },
  "12_Address incorrect": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "12_Blockade/unable to attempt": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "12_COD dispute - DRTO": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "12_Customer not available": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "12_Customer reject order - DRTO": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "12_Customer reschedule order": { scan_type: "UD", pickrr_sub_status_code: "CD" },
  "12_Customer unreachable": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "12_Failed Delivery": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "12_Not Attempted - DTW": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "12_Not attempted - Pidge": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "12_Requested by Brand": { scan_type: "UD", pickrr_sub_status_code: "CI" },
  20: { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  22: { scan_type: "RTD", pickrr_sub_status_code: "" },
  "21_RTO Undelviered": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "21_CX Unavailable": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "21_Area Unserviceable": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "21_CX Reject RTO": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "21_RTO Closed": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  40: { scan_type: "OT", pickrr_sub_status_code: "" },
  41: { scan_type: "OT", pickrr_sub_status_code: "" },
};

module.exports = {
  PIDGE_PARTITION_COUNT,
  PIDGE_CODE_MAPPER,
  PIDGE_TOPIC_COUNT,
};

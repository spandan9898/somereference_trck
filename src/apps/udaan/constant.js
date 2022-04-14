const UDAAN_STATUS_MAPPING = {
  fw_pickup_created: { scan_type: "OM", pickrr_sub_status_code: "" },
  fw_out_for_pickup: { scan_type: "OFP", pickrr_sub_status_code: "" },
  fw_picked_up: { scan_type: "PP", pickrr_sub_status_code: "" },
  "fw_pickup_failed_seller not attempted - vehicle breakdown/traffic": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "fw_pickup_failed_seller not attempted - vehicle full": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "fw_pickup_failed_seller not attempted - no entry restriction": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "fw_pickup_failed_pickup attempted - address not found. seller not contactable": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  "fw_pickup_failed_seller not attempted - shortage of time": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "fw_pickup_failed_seller not attempted - tech issue": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  "fw_pickup_failed_attempted - shop closed": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  "fw_pickup_failed_attempted - order not packed": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "fw_pickup_failed_attempted - vehicle full": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "fw_pickup_failed_attempted - poor packaging": {
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  "fw_pickup_failed_attempted - tech issue": {
    scan_type: "PPF",
    pickrr_sub_status_code: "REJ",
  },
  "fw_pickup_failed_attempted - packet id not matching": {
    scan_type: "PPF",
    pickrr_sub_status_code: "REJ",
  },
  "fw_pickup_failed_attempted - closed due to covid impact": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  "fw_pickup_failed_seller not attempted - closed due to covid impact": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  fw_picked_not_verified: { scan_type: "PP", pickrr_sub_status_code: "" },
  fw_hub_inscan: { scan_type: "SHP", pickrr_sub_status_code: "" },
  fw_hub_outscan: { scan_type: "OT", pickrr_sub_status_code: "" },
  fw_rad: { scan_type: "RAD", pickrr_sub_status_code: "" },
  fw_out_for_delivery: { scan_type: "OO", pickrr_sub_status_code: "" },
  "fw_delivery_attempted_market shut - covid virus": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "fw_delivery_attempted_buyer not reachable over phone": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "fw_delivery_attempted_buyer not available/shop closed/out of station": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "fw_delivery_attempted_cash not ready": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "fw_delivery_attempted_address not found": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "fw_delivery_attempted_open delivery": { scan_type: "UD", pickrr_sub_status_code: "OPDEL" },
  "fw_delivery_attempted_buyer rejected - shipment tampered": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "fw_delivery_attempted_shipment rto": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "fw_delivery_attempted_buyer expecting credit order/ gst or invoice issue": {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "fw_delivery_attempted_issue with previous order/ rvp": {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "fw_delivery_attempted_buyer refused to sign pod/ runsheet": {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "fw_delivery_attempted_incorrect pincode": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "fw_delivery_attempted_delivery charge issue": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  cancelled: { scan_type: "OC", pickrr_sub_status_code: "" },
  fw_delivered: { scan_type: "DL", pickrr_sub_status_code: "" },
  rt_rto_marked: { scan_type: "RTO", pickrr_sub_status_code: "" },
  rto_marked: { scan_type: "RTO", pickrr_sub_status_code: "" },
  rt_hub_inscan: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  rt_hub_outscan: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  rt_rad: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  rt_out_for_delivery: { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  rt_delivered: { scan_type: "RTD", pickrr_sub_status_code: "" },
};

const PUSH_TOPIC_COUNT = 1;
const PUSH_PARTITION_COUNT = 10;
const PUSH_GROUP_NAME = "udaan-push-group";
const PUSH_TOPIC_NAME = "udaan_push";
module.exports = {
  UDAAN_STATUS_MAPPING,
  PUSH_TOPIC_COUNT,
  PUSH_PARTITION_COUNT,
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
};

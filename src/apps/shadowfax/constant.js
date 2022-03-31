const SHADOWFAX_CODE_MAPPER = {
  recd_at_rev_hub: "PP",
  sent_to_fwd: "OT",
  recd_at_fwd_hub: "OT",
  recd_at_fwd_dc: "OT",
  assigned_for_delivery: "OT",
  ofd: "OO",
  delivered: "DL",
  cid: "NDR",
  nc: "NDR",
  na: "NDR",
  reopen_ndr: "OT",
  cancelled_by_customer: "NDR",
  cancelled_by_seller: "NDR",
  rts: "RTO",
  rts_d: "RTD",
  lost: "OT",
  on_hold: "OT",
};

const SHADOWFAX_PULL_CODE_MAPPER_1 = {
  "pickup_on_hold_customer want pick-up from non-serviceable area": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "pickup_on_hold_pincode address mismatch": { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  "pickup_on_hold_incorrect contact number": { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  "pickup_on_hold_address issue": { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  "pickup_on_hold_customer wants replacement/refund first": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup_on_hold_incomplete information received from client": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup_on_hold_mandatory check not available": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup_on_hold_pickup already done by other dsp": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup_on_hold_shipment is not picked": { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  "pickup_on_hold_successful 3 attempts done": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "pickup_on_hold_large shipment": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "pickup_on_hold_customer wants pickup beyond cut off time": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup_on_hold_customer changed his/her mind": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "pickup_on_hold_doorstep qc brandbox not available": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup_on_hold_doorstep qc price tag missing": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup_on_hold_doorstep qc product damage": { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  "pickup_on_hold_doorstep qc product mismatch": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup_on_hold_covid restricted area": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "pickup_on_hold_seller wants pickup beyond cut off time": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "pickup_on_hold_non serviceable area": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "pickup_on_hold_unable to pickup in given slot": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "pickup_on_hold_doorstep qc used item": { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  "on_hold_incorrect/incomplete contact info.": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "on_hold_pincode/address mismatch": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "on_hold_customer wants open delivery": { scan_type: "UD", pickrr_sub_status_code: "OPDEL" },
  "on_hold_customer shifted from given address": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "on_hold_non serviceable area": { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "on_hold_customer wants delivery on another address": {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "on_hold_high volume shipment": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "on_hold_three succesful attempts done": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "on_hold_customer wants delivery beyond cut-off date": {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "on_hold_payment issue": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "on_hold_high ageing": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "on_hold_successful attempts done": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "on_hold_covid restricted area": { scan_type: "UD", pickrr_sub_status_code: "REST" },
  "nc_customer not contactable": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "nc_residence or office closed": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "na_not attempted": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "na_vehicle breakdown": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "na_heavy rain": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "recd_at_fwd_dc_received at forward dc": { scan_type: "OT", pickrr_sub_status_code: "" },
  "recd_at_fwd_dc_received at rts dc": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "cancelled_by_customer_cancelled by customer": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "cancelled_by_customer_cancelled as per client's request": {
    scan_type: "OC",
    pickrr_sub_status_code: "",
  },
  "cancelled_by_customer_third successful attempt": { scan_type: "OC", pickrr_sub_status_code: "" },
  "cancelled_by_customer_cancelled by client": { scan_type: "OC", pickrr_sub_status_code: "" },
};

const SHADOWFAX_PULL_CODE_MAPPER_2 = {
  new: { scan_type: "OM", pickrr_sub_status_code: "" },
  assigned_for_pickup: { scan_type: "OM", pickrr_sub_status_code: "" },
  ofp: { scan_type: "OFP", pickrr_sub_status_code: "" },
  recd_at_rev_hub: { scan_type: "SHP", pickrr_sub_status_code: "" },
  received_at_pickup_hub: { scan_type: "OT", pickrr_sub_status_code: "" },
  in_manifest: { scan_type: "OT", pickrr_sub_status_code: "" },
  in_transit: { scan_type: "OT", pickrr_sub_status_code: "" },
  received_at_via: { scan_type: "OT", pickrr_sub_status_code: "" },
  recd_at_fwd_hub: { scan_type: "RAD", pickrr_sub_status_code: "" },
  assigned_for_delivery: { scan_type: "RAD", pickrr_sub_status_code: "" },
  ofd: { scan_type: "OO", pickrr_sub_status_code: "" },
  seller_not_contactable: { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  pickup_not_attempted: { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  seller_initiated_delay: { scan_type: "PPF", pickrr_sub_status_code: "" },
  cid: { scan_type: "UD", pickrr_sub_status_code: "CD" },
  rts_in_process: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  rts_d: { scan_type: "RTD", pickrr_sub_status_code: "" },
  rts_nd: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  lost: { scan_type: "LT", pickrr_sub_status_code: "" },
  delivered: { scan_type: "DL", pickrr_sub_status_code: "" },
  item_delivered_at: { scan_type: "DL", pickrr_sub_status_code: "" },
  rts_ofd: { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  in_transit_return: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
};

const SHADOWFAX_TOPICS_COUNT = 1;
const SHADOWFAX_PARTITIONS_COUNT = 10;
const SHADOWFAX_PULL_TOPIC_NAME = "shadowfax_pull";
const SHADOWFAX_PUSH_TOPIC_NAME = "shadowfax_push";
const SHADOWFAX_PULL_GROUP_NAME = "shadowfax-pull-group";
const SHADOWFAX_PUSH_GROUP_NAME = "shadowfax-push-group";

module.exports = {
  SHADOWFAX_CODE_MAPPER,
  SHADOWFAX_TOPICS_COUNT,
  SHADOWFAX_PARTITIONS_COUNT,
  SHADOWFAX_PULL_CODE_MAPPER_1,
  SHADOWFAX_PULL_CODE_MAPPER_2,
  SHADOWFAX_PULL_TOPIC_NAME,
  SHADOWFAX_PUSH_TOPIC_NAME,
  SHADOWFAX_PULL_GROUP_NAME,
  SHADOWFAX_PUSH_GROUP_NAME,
};

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
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "cancelled_by_customer_third successful attempt": { scan_type: "OC", pickrr_sub_status_code: "" },
  "cancelled_by_customer_cancelled by client": { scan_type: "OC", pickrr_sub_status_code: "" },
  "nc_customer is not contactable for delivery": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "na_customer delivery was not attempted by shadowfax rider": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "cancelled_by_customer_delivery request has been cancelled by customer": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
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
  rts: { scan_type: "RTO", pickrr_sub_status_code: "" },
  lost: { scan_type: "LT", pickrr_sub_status_code: "" },
  delivered: { scan_type: "DL", pickrr_sub_status_code: "" },
  item_delivered_at: { scan_type: "DL", pickrr_sub_status_code: "" },
  rts_ofd: { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  in_transit_return: { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  item_manifested: { scan_type: "OT", pickrr_sub_status_code: "" },
  bag_in_transit: { scan_type: "OT", pickrr_sub_status_code: "" },
  bag_received_at_via: { scan_type: "OT", pickrr_sub_status_code: "" },
  assigned_for_seller_pickup: { scan_type: "OM", pickrr_sub_status_code: "" },
  cancelled_by_seller: { scan_type: "PPF", pickrr_sub_status_code: "CANC" }
};

const SHADOWFAX_REVERSE_MAPPER = {
  "not contactable": { pickrr_sub_status_code: "CNA", scan_type: "PPF" },
  "pickup_on_hold_customer changed his/her mind": {
    pickrr_sub_status_code: "SNR",
    scan_type: "PPF",
  },
  "pickup_on_hold_customer wants replacement/refund first": {
    pickrr_sub_status_code: "OTH",
    scan_type: "PPF",
  },
  "qc failed": { pickrr_sub_status_code: "CI", scan_type: "PPF" },
  "pickup_on_hold_customer want pick-up from non-serviceable area": {
    pickrr_sub_status_code: "NSL",
    scan_type: "PPF",
  },
  "pickup_on_hold_doorstep qc product damage": { pickrr_sub_status_code: "OTH", scan_type: "PPF" },
  "not attempted": { pickrr_sub_status_code: "SD", scan_type: "PPF" },
  new: { pickrr_sub_status_code: "", scan_type: "OP" },
  "pickup_on_hold_address issue": { pickrr_sub_status_code: "AI", scan_type: "PPF" },
  "pickup_on_hold_doorstep qc brandbox not available": {
    pickrr_sub_status_code: "OTH",
    scan_type: "PPF",
  },
  "pickup_on_hold_shipment is not picked": { pickrr_sub_status_code: "OTH", scan_type: "PPF" },
  "pickup_on_hold_mandatory check not available": {
    pickrr_sub_status_code: "OTH",
    scan_type: "PPF",
  },
  "pickup_on_hold_customer wants pickup beyond cut off time": {
    pickrr_sub_status_code: "OTH",
    scan_type: "PPF",
  },
  "pickup_on_hold_doorstep qc product mismatch": {
    pickrr_sub_status_code: "OTH",
    scan_type: "PPF",
  },
  "pickup_on_hold_large shipment": { pickrr_sub_status_code: "NA", scan_type: "PPF" },
  "pickup_on_hold_incomplete information received from client": {
    pickrr_sub_status_code: "OTH",
    scan_type: "PPF",
  },
  undelivered: { pickrr_sub_status_code: "OTH", scan_type: "UD" },
  "pickup_on_hold_covid restricted area": { pickrr_sub_status_code: "NSL", scan_type: "PPF" },
  "pickup_on_hold_doorstep qc price tag missing": {
    pickrr_sub_status_code: "OTH",
    scan_type: "PPF",
  },
  received: { pickrr_sub_status_code: "", scan_type: "OT" },
  "pickup_on_hold_unable to pickup in given slot": {
    pickrr_sub_status_code: "NA",
    scan_type: "PPF",
  },
  "out for pickup": { pickrr_sub_status_code: "", scan_type: "OFP" },
  lost: { pickrr_sub_status_code: "", scan_type: "LT" },
  "pickup_on_hold_incorrect contact number": { pickrr_sub_status_code: "SU", scan_type: "PPF" },
  "pickup_on_hold_seller wants pickup beyond cut off time": {
    pickrr_sub_status_code: "SNR",
    scan_type: "PPF",
  },
  "pickup_on_hold_non serviceable area": { pickrr_sub_status_code: "NSL", scan_type: "PPF" },
  "pickup_on_hold_pickup already done by other dsp": {
    pickrr_sub_status_code: "OTH",
    scan_type: "PPF",
  },
  "returned to client": { pickrr_sub_status_code: "", scan_type: "DL" },
  "assigned for customer pickup": { pickrr_sub_status_code: "", scan_type: "OM" },
  cid: { pickrr_sub_status_code: "CI", scan_type: "PPF" },
  "received at return dc": { pickrr_sub_status_code: "", scan_type: "OT" },
  "pickup_on_hold_successful 3 attempts done": { pickrr_sub_status_code: "SNR", scan_type: "PPF" },
  "pickup_on_hold_doorstep qc used item": { pickrr_sub_status_code: "OTH", scan_type: "PPF" },
  "pickup_on_hold_pincode address mismatch": { pickrr_sub_status_code: "AI", scan_type: "PPF" },
  picked: { pickrr_sub_status_code: "", scan_type: "PP" },
  cancelled: { pickrr_sub_status_code: "", scan_type: "OC" },
};

const PUSH_PARTITION_COUNT = 10;
const PULL_PARTITION_COUNT = 10;
const PULL_TOPIC_NAME = "shadowfax_pull";
const PUSH_TOPIC_NAME = "shadowfax_push";
const PULL_GROUP_NAME = "shadowfax-pull-group";
const PUSH_GROUP_NAME = "shadowfax-push-group";

module.exports = {
  SHADOWFAX_CODE_MAPPER,
  PUSH_PARTITION_COUNT,
  PULL_PARTITION_COUNT,
  SHADOWFAX_PULL_CODE_MAPPER_1,
  SHADOWFAX_PULL_CODE_MAPPER_2,
  PULL_TOPIC_NAME,
  PUSH_TOPIC_NAME,
  PULL_GROUP_NAME,
  PUSH_GROUP_NAME,
  SHADOWFAX_REVERSE_MAPPER,
};

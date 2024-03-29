const XBS_STATUS_MAPPER = {
  "data received-drc": { scan_type: "OP", pickrr_sub_status_code: "" },
  "pickup created-puc": { scan_type: "OM", pickrr_sub_status_code: "" },
  "out for pickup-ofp": { scan_type: "OFP", pickrr_sub_status_code: "" },
  "pickdone-pud": { scan_type: "PP", pickrr_sub_status_code: "" },
  "6-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "9-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "0-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "7-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "3-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "13-pnd": { scan_type: "PPF", pickrr_sub_status_code: "HO" },
  "14-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "10-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  "18-pnd": { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  "1-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "8-pnd": { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  "12-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SC" },
  "4-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "picked-pkd": { scan_type: "SHP", pickrr_sub_status_code: "" },
  "in transit-it": { scan_type: "OT", pickrr_sub_status_code: "" },
  "reached at destination-rad": { scan_type: "RAD", pickrr_sub_status_code: "" },
  "out for delivery-ofd": { scan_type: "OO", pickrr_sub_status_code: "" },
  "2-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "3-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "4-ud": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "6-ud": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "8-ud": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "9-ud": { scan_type: "UD", pickrr_sub_status_code: "CD" },
  "14-ud": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "17-ud": { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "18-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "19-ud": { scan_type: "UD", pickrr_sub_status_code: "OPDEL" },
  "24-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "25-ud": { scan_type: "UD", pickrr_sub_status_code: "CI" },
  "27-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "29-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "30-ud": { scan_type: "UD", pickrr_sub_status_code: "REST" },
  "31-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "32-ud": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "37-ud": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "68-ud": { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "69-ud": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "70-ud": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "72-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "111-ud": { scan_type: "UD", pickrr_sub_status_code: "CR-OTP" },
  "delivered-dlvd": { scan_type: "DL", pickrr_sub_status_code: "" },
  "lost-lost": { scan_type: "LT", pickrr_sub_status_code: "" },
  "rto notified-rton": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "return to origin-rto": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "rto in transit-rto-it": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "reached at origin-rao": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "rto out for delivery-rto-ofd": { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  "rto delivered-rtd": { scan_type: "RTD", pickrr_sub_status_code: "" },
  "rto undelivered-rtu": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "shipmenttransit damage-std": { scan_type: "DM", pickrr_sub_status_code: "" },
  "shortage-stg": { scan_type: "LT", pickrr_sub_status_code: "" },
  "return to origin shortage-rto-stg": { scan_type: "LT", pickrr_sub_status_code: "" },
  "pickup not done-pnd": { scan_type: "PPF", pickrr_sub_status_code: "" },
  "22-ud": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "39-ud": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "77-ud": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "78-ud": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "79-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "80-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "81-ud": { scan_type: "UD", pickrr_sub_status_code: "CD" },
  "82-ud": { scan_type: "UD", pickrr_sub_status_code: "CD" },
  "83-ud": { scan_type: "UD", pickrr_sub_status_code: "CI" },
  "84-ud": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "86-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "87-ud": { scan_type: "UD", pickrr_sub_status_code: "REST" },
  "90-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "91-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "92-ud": { scan_type: "UD", pickrr_sub_status_code: "REST" },
  "94-ud": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "1001-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "1000-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "85-ud": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "93-ud": { scan_type: "UD", pickrr_sub_status_code: "REST" },
  "88-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "89-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "intransit-it": { scan_type: "OT", pickrr_sub_status_code: "" },
  "21-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "30-pnd": { scan_type: "PPF", pickrr_sub_status_code: "CANC" },
  "5-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "11-pnd": { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  "31-pnd": { scan_type: "PPF", pickrr_sub_status_code: "CANC" },
};

const XBS_NDR_MAPPER = {
  CR: "Customer Refused Shipment",
  CNA: "Customer Not Available/Office/Residence Closed/Consignee phone not reachable",
  AI: "Address Issue",
  CD: "Customer Delay/Future Delivery",
  REST: "Entry Restricted Area",
  "CR-OTP": "Customer Refused Shipment- OTP Verified",
  ODA: "Out of Delivery area",
  CNR: "Cash Not Ready",
  OPDEL: "Conignee wants open delivery",
  OTH: "Other",
  CI: "Customer Issue",
  SD: "Shipper Delay",
};

const XBS_REVERSE_MAPPER = {
  "rppickuppending-": { scan_type: "OM", pickrr_sub_status_code: "" },
  "rppickdone-": { scan_type: "PP", pickrr_sub_status_code: "" },
  "rpoutforpickup-": { scan_type: "OFP", pickrr_sub_status_code: "" },
  "rpcancel-": { scan_type: "OC", pickrr_sub_status_code: "" },
  "rpattemptnotpick-2": { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  "rpattemptnotpick-3": { scan_type: "PPF", pickrr_sub_status_code: "DAM" },
  "rpattemptnotpick-4": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "rpattemptnotpick-5": { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  "rpattemptnotpick-6": { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  "rpattemptnotpick-7": { scan_type: "PPF", pickrr_sub_status_code: "HO" },
  "rpattemptnotpick-8": { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  "rpattemptnotpick-9": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "rpattemptnotpick-12": { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  "rpattemptnotpick-17": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "rpattemptnotpick-18": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "rpattemptnotpick-23": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "rpattemptnotpick-24": { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  "rpattemptnotpick-25": { scan_type: "PPF", pickrr_sub_status_code: "CANC" },
  "rpattemptnotpick-26": { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  "it-": { scan_type: "OT", pickrr_sub_status_code: "" },
  "rad-": { scan_type: "RAD", pickrr_sub_status_code: "" },
  "ofd-": { scan_type: "OO", pickrr_sub_status_code: "" },
  "ud-7": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "ud-8": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "ud-13": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "ud-14": { scan_type: "UD", pickrr_sub_status_code: "CD" },
  "ud-16": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "ud-17": { scan_type: "UD", pickrr_sub_status_code: "CI" },
  "ud-18": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "ud-19": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "ud-20": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "ud-21": { scan_type: "UD", pickrr_sub_status_code: "OPDEL" },
  "dlvd-": { scan_type: "DL", pickrr_sub_status_code: "" },
};

const XBS_PULL_MAPPER = {
  "data received-drc": { scan_type: "OP", pickrr_sub_status_code: "" },
  "pickup created-puc": { scan_type: "OM", pickrr_sub_status_code: "" },
  "out for pickup-ofp": { scan_type: "OFP", pickrr_sub_status_code: "" },
  "pickdone-pud": { scan_type: "PP", pickrr_sub_status_code: "" },
  "pickup not attempted-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "force majeure-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "pickup cancelled-pnd": { scan_type: "PPF", pickrr_sub_status_code: "CANC" },
  "long distance pincode-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "concerned person not available-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  "pickup not ready with vendor-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  "entry not permitted-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  "shop closed-pnd": { scan_type: "PPF", pickrr_sub_status_code: "SC" },
  "vendor shifted from given address-pnd": { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  "address incomplete / address not found & mobile not reachable-pnd": {
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  "order got cancelled-pnd": { scan_type: "PPF", pickrr_sub_status_code: "CANC" },
  "picked-pkd": { scan_type: "SHP", pickrr_sub_status_code: "" },
  "intransit-it": { scan_type: "OT", pickrr_sub_status_code: "" },
  "reached at destination-rad": { scan_type: "RAD", pickrr_sub_status_code: "" },
  "out for delivery-ofd": { scan_type: "OO", pickrr_sub_status_code: "" },
  "cod amount not ready-ud": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "customer wants open delivery-ud": { scan_type: "UD", pickrr_sub_status_code: "OPDEL" },
  "delivereddispute-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "nondelivereddispute-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "wrong pincode-ud": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "self collect-ud": { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "customer refused to accept-ud": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "address incomplete-ud": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "long pincode-ud": { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "force majeure situation-ud": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "customer not available-ud": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "customer wants future delivery-ud": { scan_type: "UD", pickrr_sub_status_code: "CD" },
  "customer wants evening delivery-ud": { scan_type: "UD", pickrr_sub_status_code: "CD" },
  "door step delivery not attempted-ud": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "payment could not be completed-ud": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "entry not permitted due to regulations-ud": { scan_type: "UD", pickrr_sub_status_code: "REST" },
  "delivered-dlvd": { scan_type: "DL", pickrr_sub_status_code: "" },
  "lost-lost": { scan_type: "LT", pickrr_sub_status_code: "" },
  "rto notified-rton": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "return to origin-rto": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "return to origin intransit-rto-it": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "reached at origin-rao": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "return to origin out for delivery-rto-ofd": { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  "return delivered-rtd": { scan_type: "RTD", pickrr_sub_status_code: "" },
  "return undelivered-rtu": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "shipmenttransit damage-std": { scan_type: "DM", pickrr_sub_status_code: "" },
  "shortage-stg": { scan_type: "LT", pickrr_sub_status_code: "" },
  "return to origin shortage-rto-stg": { scan_type: "LT", pickrr_sub_status_code: "" },
  "oda (out of delivery area)-ud": { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "pickup not done-pnd": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "customer denied otp based delivery-ud": { scan_type: "UD", pickrr_sub_status_code: "OTPF" },
};

const PUSH_GROUP_NAME = "xbs-push-group";
const PUSH_TOPIC_NAME = "xbs_push";
const PUSH_PARTITION_COUNT = 10;
const PULL_PARTITION_COUNT = 10;

const PULL_GROUP_NAME = "xbs_pull_group";
const PULL_TOPIC_NAME = "xbs_pull";

module.exports = {
  XBS_STATUS_MAPPER,
  XBS_NDR_MAPPER,
  XBS_REVERSE_MAPPER,
  XBS_PULL_MAPPER,
  PUSH_PARTITION_COUNT,
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
  PULL_PARTITION_COUNT,
  PULL_GROUP_NAME,
  PULL_TOPIC_NAME,
};

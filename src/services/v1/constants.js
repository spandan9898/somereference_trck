const NEW_STATUS_TO_OLD_MAPPING = {
  OFP: "OP",
  PPF: "OP",
  "RTO-OO": "RTO",
  "RTO-OT": "RTO",
  DM: "OT",
  RAD: "OT",
  SHP: "OT",
  UD: "NDR",
  "RTO UD": "RTO",
};

const PP_PROXY_LIST = [
  "PP",
  "SHP",
  "OT",
  "RAD",
  "OO",
  "NDR",
  "DL",
  "RTO",
  "RTO-OT",
  "RTO-OO",
  "RTO-UD",
  "RTD",
  "LT",
  "DM",
];

const TOPIC_NAME = "track_v1";

module.exports = { NEW_STATUS_TO_OLD_MAPPING, PP_PROXY_LIST, TOPIC_NAME };

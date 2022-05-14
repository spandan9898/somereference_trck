const REPORT_STATUS_CODE_MAPPING = {
  RTD: "RTO-RTD",
  RTO: "RTO",
  DL: "DELIVERED",
  OO: "OUT FOR DELIVERY",
  OT: "TRANSIT",
  PP: "PICKED",
  OC: "CANCELLED",
  OM: "MANIFESTED",
  OP: "PLACED",
  NDR: "UNDELIVERED",
};

const REPORT_STATUS_TYPE_MAPPING = {
  RTD: "RTD",
  RTO: "RTO",
  DL: "DELIVERED",
  OO: "OUT FOR DELIVERY",
  OT: "IN TRANSIT",
  PP: "PICKED",
  OC: "CANCELLED",
  OM: "MANIFESTED",
  OP: "PLACED",
  NDR: "UNDELIVERED",
};

const NEW_STATUS_TO_OLD_MAPPING = {
  OFP: "OM",
  PPF: "OM",
  LT: "OT",
  "RTO-OO": "RTO",
  "RTO-OT": "RTO",
  DM: "OT",
  RAD: "OT",
  SHP: "OT",
  UD: "NDR",
  "RTO UD": "RTO",
};

module.exports = {
  REPORT_STATUS_CODE_MAPPING,
  REPORT_STATUS_TYPE_MAPPING,
  NEW_STATUS_TO_OLD_MAPPING,
};

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
  QCF: "QC FAILED",
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
  QCF: "QC FAILED",
  LT: "LOST",
  QCF: "QC FAILED",
};

const NEW_STATUS_TO_OLD_MAPPING = {
  OFP: "OM",
  PPF: "OM",
  "RTO-OO": "RTO",
  "RTO-OT": "RTO",
  DM: "OT",
  RAD: "OT",
  SHP: "OT",
  UD: "NDR",
  "RTO UD": "RTO",
};

const VALID_FAD_NDR_SUBSTATUS_CODE = [
  "CR",
  "CNA",
  "AI",
  "CD",
  "REST",
  "CR",
  "OTP",
  "CNR",
  "OPDEL",
  "CI",
  "OTPF",
];
module.exports = {
  REPORT_STATUS_CODE_MAPPING,
  REPORT_STATUS_TYPE_MAPPING,
  NEW_STATUS_TO_OLD_MAPPING,
  VALID_FAD_NDR_SUBSTATUS_CODE,
};

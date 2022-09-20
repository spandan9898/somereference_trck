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
const CUSTOMER_DRIVEN_NDR_REASON = [
  "CR",
  "CNA",
  "AI",
  "CD",
  "CR-OTP ",
  "CNR",
  "OPDEL",
  "CI",
  "OTPF",
];

const PPF_REPORT_STATUS_CODE_MAPPINGS = {
  SC: "Shop closed",
  SU: "Seller Uncontactable",
  SNR: "Shipment not ready/ Future Pickup date by seller",
  NA: "No attempt by courier",
  VC: "Vehicle constraint",
  NSL: "Non serviceable location/ Entry Restricted area",
  HO: "Shipment handover to other courier",
  REJ: "AWB Rejected/ Barcode Issue/ Prohibited Item",
  AI: "Address issue",
  AE: "Attempts exhausted",
  OTH: "Others",
  CANC: "Pickup canceled by seller",
  REGU: "Paperwork issue",
  BCUT: "Pickup attempt beyond cutoff",
  DUP: "Duplicate Pickup",
};

module.exports = {
  REPORT_STATUS_CODE_MAPPING,
  REPORT_STATUS_TYPE_MAPPING,
  NEW_STATUS_TO_OLD_MAPPING,
  VALID_FAD_NDR_SUBSTATUS_CODE,
  CUSTOMER_DRIVEN_NDR_REASON,
  PPF_REPORT_STATUS_CODE_MAPPINGS,
};

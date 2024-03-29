const SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS = [
  "19055fe5e1ae547af39f0543ad1dc2ec166514",
  "2dcb7eec8341716c8f32f688dc32a531166515",
  "af338989a47902520b3070e4e006371a166516",
  "242bc5bc67f0eff1d5924541d2711ca9167069",
  "4f315f7a24b24977ae0804b9f2a4bf06166522",
  "c82f7d4d83ab952711a8422413298e5d166524",
  "f43e1eac7f9af6dbf53098235f8098a0166525",
  "7879d2d1aff0bdfa60510881d046601e167072",
];

const SMART_SHIP_AUTH_TOKENS = [
  "7879d2d1aff0bdfa60510881d046601e167072",
  "f43e1eac7f9af6dbf53098235f8098a0166525",
  "c82f7d4d83ab952711a8422413298e5d166524",
  "4f315f7a24b24977ae0804b9f2a4bf06166522",
];

const COMPULSORY_EVENTS = {
  PP: ["OP", "OM", "OFP", "PPF"],
  DL: ["OP", "OM", "OFP", "PPF", "PP", "SHP", "OT", "OO", "RTD"],
  RTO: ["OP", "OM", "OFP", "PPF", "PP", "SHP", "OT", "OO"],
  RTD: ["OP", "OM", "OFP", "PPF", "OT", "OO", "UD", "NDR", "RTO", "RTO-OT", "RTO-OO", "RTO-UD"],
  SHP: ["OP", "OM", "OFP", "PPF", "PP"],
  RAD: ["OP", "OM", "OFP", "PPF", "PP", "OT"],
  OO: ["OP", "OM", "OFP", "PPF", "PP", "OT", "RAD"],
  QCF: ["OP", "OM", "OFP", "PPF"],
};

const COMPULSORY_EVENTS_PRECEDENCE = [["PP"], ["SHP", "RAD", "OO"], ["QCF", "DL", "RTO", "RTD"]];

const STATUS_PROXY_LIST = {
  PP: [
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
  ],
  SHP: [
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
  ],
  RAD: ["RAD", "OO", "NDR", "DL", "RTO", "RTO-OT", "RTO-OO", "RTO-UD", "RTD", "LT", "DM"],
  OO: ["OO", "NDR", "DL", "RTO", "RTO-OT", "RTO-OO", "RTO-UD", "RTD", "LT", "DM"],
  RTO: ["RTO", "RTO-OT", "RTO-OO", "RTO-UD", "RTD"],
  RTD: ["RTD"],
  DL: ["DL"],
  QCF: ["QCF"],
};

module.exports = {
  SHOPCLUES_COURIER_PARTNERS_AUTH_TOKENS,
  SMART_SHIP_AUTH_TOKENS,
  COMPULSORY_EVENTS,
  COMPULSORY_EVENTS_PRECEDENCE,
  STATUS_PROXY_LIST,
};

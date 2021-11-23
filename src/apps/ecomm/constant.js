const ECOMM_CODE_MAPPER = {
  "001": { pickrr_status_code: "OP", pickrr_sub_status_code: "" },
  "013": { pickrr_status_code: "OM", pickrr_sub_status_code: "" },
  1210: { pickrr_status_code: "OM", pickrr_sub_status_code: "" },
  1220: { pickrr_status_code: "OM", pickrr_sub_status_code: "" },
  1230: { pickrr_status_code: "OFP", pickrr_sub_status_code: "" },
  1260: { pickrr_status_code: "PP", pickrr_sub_status_code: "" },
  1310: { pickrr_status_code: "PPF", pickrr_sub_status_code: "OTH" },
  1320: { pickrr_status_code: "PPF", pickrr_sub_status_code: "HO" },
  1330: { pickrr_status_code: "PPF", pickrr_sub_status_code: "CANC" },
  1340: { pickrr_status_code: "PPF", pickrr_sub_status_code: "SNR" },
  1350: { pickrr_status_code: "PPF", pickrr_sub_status_code: "SNR" },
  1360: { pickrr_status_code: "PPF", pickrr_sub_status_code: "SC" },
  1370: { pickrr_status_code: "PPF", pickrr_sub_status_code: "AI" },
  1380: { pickrr_status_code: "PPF", pickrr_sub_status_code: "NA" },
  1390: { pickrr_status_code: "PPF", pickrr_sub_status_code: "NA" },
  1400: { pickrr_status_code: "PPF", pickrr_sub_status_code: "NA" },
  1410: { pickrr_status_code: "PPF", pickrr_sub_status_code: "NA" },
  1420: { pickrr_status_code: "PPF", pickrr_sub_status_code: "REJ" },
  1430: { pickrr_status_code: "PPF", pickrr_sub_status_code: "NA" },
  "0011": { pickrr_status_code: "PP", pickrr_sub_status_code: "" },
  "014": { pickrr_status_code: "OFP", pickrr_sub_status_code: "" },
  310: { pickrr_status_code: "PPF", pickrr_sub_status_code: "OTH" },
  326: { pickrr_status_code: "PPF", pickrr_sub_status_code: "CANC" },
  334: { pickrr_status_code: "PPF", pickrr_sub_status_code: "DAM" },
  "002": { pickrr_status_code: "SHP", pickrr_sub_status_code: "" },
  127: { pickrr_status_code: "SHP", pickrr_sub_status_code: "" },
  "003": { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  "004": { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  "005": { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  "006": { pickrr_status_code: "OO", pickrr_sub_status_code: "" },
  100: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  101: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  203: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  205: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  240: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  301: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  303: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  304: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  305: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  306: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  307: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  308: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  309: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  230: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  325: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  200: { pickrr_status_code: "UD", pickrr_sub_status_code: "CI" },
  201: { pickrr_status_code: "UD", pickrr_sub_status_code: "CI" },
  207: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  209: { pickrr_status_code: "UD", pickrr_sub_status_code: "CNR" },
  210: { pickrr_status_code: "UD", pickrr_sub_status_code: "CR" },
  211: { pickrr_status_code: "RTO UD" },
  212: { pickrr_status_code: "UD", pickrr_sub_status_code: "CNA" },
  213: { pickrr_status_code: "UD", pickrr_sub_status_code: "CD" },
  214: { pickrr_status_code: "UD", pickrr_sub_status_code: "CNA" },
  215: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  216: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  217: { pickrr_status_code: "UD", pickrr_sub_status_code: "ODA" },
  218: { pickrr_status_code: "UD", pickrr_sub_status_code: "AI" },
  219: { pickrr_status_code: "UD", pickrr_sub_status_code: "CNA" },
  220: { pickrr_status_code: "UD", pickrr_sub_status_code: "AI" },
  221: { pickrr_status_code: "RTO UD", pickrr_sub_status_code: "" },
  222: { pickrr_status_code: "UD", pickrr_sub_status_code: "AI" },
  223: { pickrr_status_code: "UD", pickrr_sub_status_code: "AI" },
  224: { pickrr_status_code: "UD", pickrr_sub_status_code: "AI" },
  226: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  227: { pickrr_status_code: "UD", pickrr_sub_status_code: "CNA" },
  228: { pickrr_status_code: "UD", pickrr_sub_status_code: "ODA" },
  229: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  231: { pickrr_status_code: "UD", pickrr_sub_status_code: "CNA" },
  232: { pickrr_status_code: "UD", pickrr_sub_status_code: "CD" },
  233: { pickrr_status_code: "UD", pickrr_sub_status_code: "CNR" },
  234: { pickrr_status_code: "UD", pickrr_sub_status_code: "AI" },
  235: { pickrr_status_code: "UD", pickrr_sub_status_code: "CR" },
  236: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  331: { pickrr_status_code: "UD", pickrr_sub_status_code: "CD" },
  332: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  333: { pickrr_status_code: "LT", pickrr_sub_status_code: "" },
  666: { pickrr_status_code: "UD", pickrr_sub_status_code: "ODA" },
  888: { pickrr_status_code: "DM", pickrr_sub_status_code: "" },
  1224: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  1225: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  999: { pickrr_status_code: "DL", pickrr_sub_status_code: "" },
  204: { pickrr_status_code: "DL", pickrr_sub_status_code: "" },
  777: { pickrr_status_code: "RTO", pickrr_sub_status_code: "" },
  77: { pickrr_status_code: "RTO", pickrr_sub_status_code: "" },
  239: { pickrr_status_code: "UD", pickrr_sub_status_code: "CI" },
  241: { pickrr_status_code: "UD", pickrr_sub_status_code: "OTH" },
  242: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  302: { pickrr_status_code: "DM", pickrr_sub_status_code: "" },
  23201: { pickrr_status_code: "UD", pickrr_sub_status_code: "REST" },
  23202: { pickrr_status_code: "UD", pickrr_sub_status_code: "SD" },
  30401: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  30402: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  30404: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  30405: { pickrr_status_code: "OT", pickrr_sub_status_code: "" },
  R999: { pickrr_status_code: "RTD", pickrr_sub_status_code: "" },
};

module.exports = {
  ECOMM_CODE_MAPPER,
};

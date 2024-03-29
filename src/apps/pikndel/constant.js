const PUSH_PARTITION_COUNT = 10;
const PUSH_TOPIC_NAME = "pikndel_push";
const PUSH_GROUP_NAME = "pikndel-push-group";

const PULL_PARTITION_COUNT = 10;
const PULL_TOPIC_NAME = "pikndel_pull";
const PULL_GROUP_NAME = "pikndel_pull_group";

const PIKNDEL_STATUS_MAPPER = {
  new: { scan_type: "OM", pickrr_sub_status_code: "" },
  rap: { scan_type: "OP", pickrr_sub_status_code: "" },
  arp: { scan_type: "OP", pickrr_sub_status_code: "" },
  ofp: { scan_type: "OFP", pickrr_sub_status_code: "" },
  arv: { scan_type: "OFP", pickrr_sub_status_code: "" },
  pck: { scan_type: "PP", pickrr_sub_status_code: "" },
  pcn: { scan_type: "PPF", pickrr_sub_status_code: "" },
  dth: { scan_type: "SHP", pickrr_sub_status_code: "" },
  rah: { scan_type: "SHP", pickrr_sub_status_code: "" },
  itr: { scan_type: "OT", pickrr_sub_status_code: "" },
  rad: { scan_type: "RAD", pickrr_sub_status_code: "" },

  // ard: { scan_type: "RAD", pickrr_sub_status_code: "" },

  ofd: { scan_type: "OO", pickrr_sub_status_code: "" },
  rch: { scan_type: "OO", pickrr_sub_status_code: "" },
  dld: { scan_type: "DL", pickrr_sub_status_code: "" },
  can: { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  crd: { scan_type: "RTO", pickrr_sub_status_code: "" },
  cfd: { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  rto: { scan_type: "RTD", pickrr_sub_status_code: "" },
  ant: { scan_type: "UD", pickrr_sub_status_code: "AI" },
  clj: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  cna: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  er: { scan_type: "UD", pickrr_sub_status_code: "REST" },
  idr: { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  iwa: { scan_type: "UD", pickrr_sub_status_code: "AI" },
  loc: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  lpi: { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  nsp: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  nsa: { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  pnm: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  rta: { scan_type: "UD", pickrr_sub_status_code: "CR" },
  shi: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  pos: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  pdoc: { scan_type: "PPF", pickrr_sub_status_code: "HO" },
  snpp: { scan_type: "PPF", pickrr_sub_status_code: "DAM" },
  cnap: { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  pa3d: { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  chhr: { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  qi: { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  crth: { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  croc: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  tafc: { scan_type: "UD", pickrr_sub_status_code: "CI" },
  lsv: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  ctz: { scan_type: "UD", pickrr_sub_status_code: "REST" },
  qcf: { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  cov: { scan_type: "UD", pickrr_sub_status_code: "REST" },
  cld: { scan_type: "UD", pickrr_sub_status_code: "REST" },
  gdl: { scan_type: "UD", pickrr_sub_status_code: "SD" },
  wfh: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  cnr: { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  rant: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rclj: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rcna: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rer: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  ridr: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  riwa: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rloc: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rlpi: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rnsp: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rnsa: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rpnm: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rrta: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rshi: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rpos: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rcroc: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rtafc: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rlsv: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rctz: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rcov: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rcld: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rgdl: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  rwfh: { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  cant: { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  cer: { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  cidr: { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  ciwa: { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  cloc: { scan_type: "PPF", pickrr_sub_status_code: "SC" },
  cnsp: { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  cnsa: { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  cpnm: { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  cshi: { scan_type: "PPF", pickrr_sub_status_code: "AI" },
  cpos: { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  cpdoc: { scan_type: "PPF", pickrr_sub_status_code: "HO" },
  csnpp: { scan_type: "PPF", pickrr_sub_status_code: "DAM" },
  ccnap: { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  cpa3d: { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  ccrth: { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  ccroc: { scan_type: "PPF", pickrr_sub_status_code: "SC" },
  ctafc: { scan_type: "PPF", pickrr_sub_status_code: "CANC" },
  clsv: { scan_type: "PPF", pickrr_sub_status_code: "SC" },
  cctz: { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  cqcf: { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  ccld: { scan_type: "PPF", pickrr_sub_status_code: "NSL" },
  pant: { scan_type: "UD", pickrr_sub_status_code: "AI" },
  pcna: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  ph: { scan_type: "UD", pickrr_sub_status_code: "SD" },
  pl: { scan_type: "UD", pickrr_sub_status_code: "REST" },
  pna: { scan_type: "UD", pickrr_sub_status_code: "SD" },
  pm: { scan_type: "UD", pickrr_sub_status_code: "SD" },
  cnc: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  r3d: { scan_type: "UD", pickrr_sub_status_code: "CD" },
  pawc: { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  lfv: { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  pfl: { scan_type: "UD", pickrr_sub_status_code: "REST" },
  can_ant: {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  can_clj: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_cna: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_er: {
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  can_idr: {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  can_iwa: {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  can_loc: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_lpi: {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  can_nsp: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_nsa: {
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  can_pnm: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_rta: {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  can_shi: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_pos: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_croc: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_tafc: {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  can_lsv: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_ctz: {
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  can_cov: {
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  can_cld: {
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  can_gdl: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  can_wfh: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  can_cnr: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  pen_pant: {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  pen_pcna: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  pen_ph: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  pen_pl: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  pen_pna: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  pen_pm: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  pen_cnc: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  pen_r3d: {
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  pen_pawc: {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  pen_lfv: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  pen_pfl: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  can_cant: {
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  can_cer: {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  can_cidr: {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  can_ciwa: {
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  can_cloc: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  can_cnsp: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  can_cnsa: {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  can_cpnm: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  can_cshi: {
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  can_cpos: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  can_cpdoc: {
    scan_type: "PPF",
    pickrr_sub_status_code: "HO",
  },
  can_csnpp: {
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  can_ccnap: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  can_cpa3d: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  can_ccrth: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  can_ccroc: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  can_ctafc: {
    scan_type: "PPF",
    pickrr_sub_status_code: "canC",
  },
  can_clsv: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  can_cctz: {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  can_cqcf: {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  can_ccld: {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
};

module.exports = {
  PUSH_PARTITION_COUNT,
  PUSH_TOPIC_NAME,
  PUSH_GROUP_NAME,
  PIKNDEL_STATUS_MAPPER,
  PULL_GROUP_NAME,
  PULL_PARTITION_COUNT,
  PULL_TOPIC_NAME,
};

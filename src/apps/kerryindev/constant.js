const KERRYINDEV_CODE_MAPPER = {
  spu: { scan_type: "OP", pickrr_sub_status_code: "" },

  ldp: { scan_type: "OT", pickrr_sub_status_code: "" },

  sao: { scan_type: "OT", pickrr_sub_status_code: "" },

  ofd: { scan_type: "OO", pickrr_sub_status_code: "" },

  smr: { scan_type: "OT", pickrr_sub_status_code: "" },

  pud: { scan_type: "PP", pickrr_sub_status_code: "" },

  cns: { scan_type: "UD", pickrr_sub_status_code: "AI" },

  crf: { scan_type: "UD", pickrr_sub_status_code: "FD" },

  drc: { scan_type: "UD", pickrr_sub_status_code: "CNA" },

  ica: { scan_type: "UD", pickrr_sub_status_code: "AI" },

  osa: { scan_type: "UD", pickrr_sub_status_code: "ODA" },

  rta: { scan_type: "UD", pickrr_sub_status_code: "CR" },

  sph: { scan_type: "UD", pickrr_sub_status_code: "SD" },

  cna: { scan_type: "UD", pickrr_sub_status_code: "CNA" },

  cos: { scan_type: "UD", pickrr_sub_status_code: "CNA" },

  era: { scan_type: "UD", pickrr_sub_status_code: "REST" },

  dpt: { scan_type: "UD", pickrr_sub_status_code: "CNA" },

  dis: { scan_type: "UD", pickrr_sub_status_code: "OTH" },

  spd: { scan_type: "DL", pickrr_sub_status_code: "" },

  spl: { scan_type: "LT", pickrr_sub_status_code: "" },

  rts: { scan_type: "RTD", pickrr_sub_status_code: "" },

  oda: { scan_type: "", pickrr_sub_status_code: "" },

  rdt: { scan_type: "", pickrr_sub_status_code: "" },

  cbc: { scan_type: "OC", pickrr_sub_status_code: "" },

  wab: { scan_type: "OC", pickrr_sub_status_code: "" },

  odd: { scan_type: "UD", pickrr_sub_status_code: "" },
};
const PULL_GROUP_NAME = "kerryindev-pull-group";
const PULL_TOPIC_NAME = "kerryindev_pull";
const PULL_PARTITION_COUNT = 10;

module.exports = {
  KERRYINDEV_CODE_MAPPER,
  PULL_GROUP_NAME,
  PULL_TOPIC_NAME,
  PULL_PARTITION_COUNT,
};

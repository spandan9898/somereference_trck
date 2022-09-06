const DTDC_PARTITION_COUNT = 10;
const PUSH_TOPIC_NAME = "dtdc_push";
const PUSH_GROUP_NAME = "dtdc-push-group";
const PULL_CONSUMER_TOPIC_NAME = "dtdc_pull";
const PULL_GROUP_NAME = "dtdc-pull-group";
const PULL_CONSUMER_PARTITION_COUNT = 10;
const DTDC_CODE_MAPPER = {
  bkd: {
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  opmf: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  ipmf: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  obmd: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  ibmd: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  obmn: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  ibmn: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  ombm: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  imbm: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  orbo: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  irbo: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  cdout: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  cdin: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  outdlv: {
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  dlv: {
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "nondlv_address incomplete or wrong-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "nondlv_receiver requested delivery on another date-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "nondlv_collection amount not ready-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "nondlv_covid 19 - customer refused to accept": {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "nondlv_address correct and pincode wrong-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "nondlv_office closed or door lock-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "nondlv_contact name / dept not mentioned-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "nondlv_receiver refuse delivery due to damage-(dir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "nondlv_last date over for submission-(otr)": {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "nondlv_last mile misroute-(otr)": {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "nondlv_address ok but no such person-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "nondlv_area non serviceable-(dir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "nondlv_customer will self collect-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "nondlv_receiver not available-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "nondlv_receiver refused delivery(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "nondlv_receiver shifted from given address-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "nondlv_restricted entry-(otr)": {
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "nondlv_consignment lost-(otr)": {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  nondlv_rescheduled: {
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "nondlv_covid 19 - office closed/door locked": {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "nondlv_receiver wants open delivery-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "OPDEL",
  },
  "nondlv_consignor refused rto shipment-(cir)": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "nondlv_local holiday-(otr)": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "nondlv_paperwork required-(otr)": {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "nondlv_covid19 could not attempt": {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "nondlv_otp not generated": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  rto: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  rtoopmf: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoipmf: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoobmd: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoibmd: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoobmn: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoibmn: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoombm: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoimbm: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoorbo: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtoirbo: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtocdout: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtocdin: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtooutdlv: {
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  rtodlv: {
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  rtonondlv: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  rtoormf: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  pkp: {
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  itd: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  arh: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  irto: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  inscan: {
    scan_type: "RAD",
    pickrr_sub_status_code: "",
  },
  returnd: {
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  hldup: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  irmf: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  pcsc: {
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  pcup: {
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  "pcno_shipment/item not ready": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "pcno_customer requested another date": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "pcno_customer not available": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  "pcno_address incomplete or incorrect": {
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  "pcno_office/door lock": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  "pcno_pickup missed due to natural calamity / political disturbance": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "pcno_local holiday": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "pcno_cn canceled by the customer": {
    scan_type: "PPF",
    pickrr_sub_status_code: "CANC",
  },
  "pcno_pickup cancelled by consignee/consignor": {
    scan_type: "PPF",
    pickrr_sub_status_code: "CANC",
  },
  "pcno_send through other courier": {
    scan_type: "PPF",
    pickrr_sub_status_code: "HO",
  },
  "pcno_no response from customer": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  pcaw: {
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  pcan: {
    scan_type: "PPF",
    pickrr_sub_status_code: "na",
  },
  srtoc: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  spl: {
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  rto_in_transit: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rto_process_is_initiated: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  set_rto_initiated: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
};

module.exports = {
  DTDC_CODE_MAPPER,
  DTDC_PARTITION_COUNT,
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
  PULL_GROUP_NAME,
  PULL_CONSUMER_TOPIC_NAME,
  PULL_CONSUMER_PARTITION_COUNT,
};

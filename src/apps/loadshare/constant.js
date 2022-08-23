const PUSH_PARTITION_COUNT = 10;
const PUSH_TOPIC_NAME = "loadshare_push";
const PUSH_GROUP_NAME = "loadshare-push-group";
const CODE_MAPPER = {
  booking: {
    scan_type: "OP",
    pickrr_sub_status_code: "",
  },
  booking_cancelled: {
    scan_type: "OC",
    pickrr_sub_status_code: "",
  },
  inscan: {
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  drs_scan: {
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  undelivered: {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  delivered: {
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  pickup_pending: {
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  pickup_cancelled: {
    scan_type: "PPF",
    pickrr_sub_status_code: "",
  },
  pickup_rejected: {
    scan_type: "PPF",
    pickrr_sub_status_code: "",
  },
  picked_up: {
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  rto_return_to_origin: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  rto_in: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rto_intransit: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rto_inward: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rto_drs_scan: {
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  rto_undelivered: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  rto_delivered: {
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  sl_shipment_lost: {
    scan_type: "LT",
    pickrr_sub_status_code: "",
  },
  pickup_cancelled_303: {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  pickup_cancelled_296: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  pickup_cancelled_201: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  pickup_cancelled_204: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  pickup_cancelled_295: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  pickup_cancelled_294: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },

  //   pickup_cancelled_201: {
  //     scan_type: "PPF",
  //     pickrr_sub_status_code: "NSL",
  //   },

  pickup_cancelled_293: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  pickup_cancelled_292: {
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  pickup_cancelled_291: {
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  rto_undelivered_1009: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  rto_undelivered_1011: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  rto_undelivered_1010: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  rto_undelivered_1008: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  rto_undelivered_1007: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  rto_undelivered_1006: {
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  undelivered_95: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  undelivered_900: {
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  undelivered_806: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  undelivered_132: {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  undelivered_132_otp_true: {
    scan_type: "UD",
    pickrr_sub_status_code: "CR-OTP",
  },
  undelivered_9220: {
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  undelivered_29: {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
};

const PULL_PARTITION_COUNT = 10;
const PULL_TOPIC_NAME = "loadshare_pull";
const PULL_GROUP_NAME = "loadshare_pull_group";

module.exports = {
  PUSH_PARTITION_COUNT,
  CODE_MAPPER,
  PUSH_TOPIC_NAME,
  PUSH_GROUP_NAME,
  PULL_PARTITION_COUNT,
  PULL_TOPIC_NAME,
  PULL_GROUP_NAME,
};

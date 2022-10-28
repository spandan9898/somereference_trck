const PICKRR_EDD_MATRIX = {
  A: {
    min_tat: 1,
    max_tat: 2,
  },
  B: {
    min_tat: 2,
    max_tat: 5,
  },
  C: {
    min_tat: 2,
    max_tat: 5,
  },
  D: {
    min_tat: 3,
    max_tat: 7,
  },
  E: {
    min_tat: 4,
    max_tat: 9,
  },
};

const PICKRR_EDD_MATRIX_FOR_EKART = {
  A: {
    min_tat: 1,
    max_tat: 2,
  },
  B: {
    min_tat: 2,
    max_tat: 6,
  },
  C: {
    min_tat: 4,
    max_tat: 7,
  },
  D: {
    min_tat: 5,
    max_tat: 9,
  },
  E: {
    min_tat: 6,
    max_tat: 12,
  },
};

const ZONE_REQUIRED_STATUS_SET = ["OP", "OM", "PPF", "OFP", "PP", "SHP", "OT", "RAD"];
const COMMON_TRACKING_TOPIC_NAME = "tracking_internal";
const TRACKING_PAGE_OTP_MESSAGE = " OTP VERIFIED";

module.exports = {
  PICKRR_EDD_MATRIX,
  PICKRR_EDD_MATRIX_FOR_EKART,
  ZONE_REQUIRED_STATUS_SET,
  COMMON_TRACKING_TOPIC_NAME,
  TRACKING_PAGE_OTP_MESSAGE,
};

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

const ZONE_REQUIRED_STATUS_SET = ["OP", "OM", "PPF", "OFP", "PP", "SHP", "OT", "RAD"];
module.exports = { PICKRR_EDD_MATRIX, ZONE_REQUIRED_STATUS_SET };
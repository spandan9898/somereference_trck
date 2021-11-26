const AMAZE_CODE_MAPPER = {
  "Soft Data Upload": { scan_type: "OP", pickrr_sub_status_code: "" },
  "In Scan – HUB": { scan_type: "PP", pickrr_sub_status_code: "" },
  "Bag Created For HUB": { scan_type: "SHP", pickrr_sub_status_code: "" },
  "Bag Created For BRANCH": { scan_type: "SHP", pickrr_sub_status_code: "" },
  "In Transit To HUB": { scan_type: "OT", pickrr_sub_status_code: "" },
  "In Transit To BRANCH": { scan_type: "OT", pickrr_sub_status_code: "" },
  "Bag Verified At HUB": { scan_type: "OT", pickrr_sub_status_code: "" },
  "Bag Verified At BRANCH": { scan_type: "OT", pickrr_sub_status_code: "" },
  "Shipment Received At HUB": { scan_type: "RAD", pickrr_sub_status_code: "" },
  "Shipment Received At BRANCH": { scan_type: "RAD", pickrr_sub_status_code: "" },
  "Out for Delivery": { scan_type: "OO", pickrr_sub_status_code: "" },
  "Undelivered-COD Not Ready": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "Undelivered-House Locked": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "Undelivered-Customer Asking For Future Delivery On YYYY-MM-DD": {
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "Undelivered-Out Of Delivery Area": { scan_type: "UD", pickrr_sub_status_code: "ODA" },
  "Undelivered-Misroute": { scan_type: "UD", pickrr_sub_status_code: "SD" },
  "Undelivered-Address Not Located And Customer Not Contactable": {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "Undelivered-Customer Forcibly Open The Shipment And Refused To Accept The Delivery": {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "Undelivered-Order Cancelled By Customer": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  "Undelivered-Vehicle Breakdown Could Not Attempt": {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "Undelivered-COD Amount Mismatch": { scan_type: "UD", pickrr_sub_status_code: "CNR" },
  "Undelivered-Address Pincode Mismatch": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "Undelivered-Shipment Lost": { scan_type: "UD", pickrr_sub_status_code: "OTH" },
  "Undelivered-Incomplete Address": { scan_type: "UD", pickrr_sub_status_code: "AI" },
  "Undelivered-Customer Not Contactable": { scan_type: "UD", pickrr_sub_status_code: "CNA" },
  "Undelivered-Order Cancelled By Client": { scan_type: "UD", pickrr_sub_status_code: "CR" },
  Delivered: { scan_type: "DL", pickrr_sub_status_code: "" },
  "Process to be RTO": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "RTO Initiated": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "RTO - Pending To Transit": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "RTO - Transit to HUB": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "RTO - Received By HUB": { scan_type: "RTO-OT", pickrr_sub_status_code: "" },
  "RTO OFD": { scan_type: "RTO-OO", pickrr_sub_status_code: "" },
  "RTO Undelivered": { scan_type: "RTO UD", pickrr_sub_status_code: "" },
  "RTO Delivered": { scan_type: "RTD", pickrr_sub_status_code: "" },
};

const AMAZE_TOPICS_COUNT = 2;

module.exports = {
  AMAZE_CODE_MAPPER,
  AMAZE_TOPICS_COUNT,
};

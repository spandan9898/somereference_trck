const PARCELDO_CODE_MAPPER = {
  102: {
    status: "Shipment Pickup in Process",
    pickrr_status: "Out for pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  103: {
    status: "Received at location",
    pickrr_status: "Shipped",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  104: {
    status: "Received at location",
    pickrr_status: "Shipped",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  105: {
    status: "Inbound scan",
    pickrr_status: "Shipped",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  106: {
    status: "Manifest Scan",
    pickrr_status: "Order in Transit",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  107: {
    status: "Outbound Scan",
    pickrr_status: "Order in Transit",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  108: {
    status: "Inscanned Bags, Awaiting Manifest",
    pickrr_status: "Order in Transit",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  109: {
    status: "Outbound Scan",
    pickrr_status: "Order in Transit",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  110: {
    status: "Out for Delivery",
    pickrr_status: "Order Out for Delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  111: {
    status: "Delivered",
    pickrr_status: "Order Delivered/Order Returned to Seller",
    scan_type: "DL/RTD",
    pickrr_sub_status_code: "",
  },
  112: {
    status: "Undelivered package, please contact your local WLA Branch",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  113: {
    status: "Undelivered package, please contact your local WLA Branch",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  117: {
    status: "Return To Origin",
    pickrr_status: "Order Returned Back",
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  121: {
    status: "Return Delivered",
    pickrr_status: "Order Returned to Seller",
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  122: {
    status: "Shipment Received At Facility",
    pickrr_status: "Order in Transit",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  123: {
    status: "Shipment Forwarded To Destination",
    pickrr_status: "Order in Transit",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  124: {
    status: "Data Received",
    pickrr_status: "Order Placed",
    scan_type: "OP",
    pickrr_sub_status_code: "",
  },
  125: {
    status: "Return To Origin Initiated",
    pickrr_status: "Order Returned Back",
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  126: {
    status: "Address Change Shipment Redirect",
    pickrr_status: "Order in Transit",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  127: {
    status: "Shipment Manifest Generated",
    pickrr_status: "Order Manifested",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  133: {
    status: "Shipment Picked",
    pickrr_status: "Order Picked Up",
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  134: {
    status: "Pickup Initiated",
    pickrr_status: "Out for pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  136: {
    status: "Pickup Completed",
    pickrr_status: "Out for pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  137: {
    status: "Reached at Destination",
    pickrr_status: "Reached at Destination",
    scan_type: "RAD",
    pickrr_sub_status_code: "",
  },
  138: {
    status: "Pending Child Order Data",
    pickrr_status: "Not to be mapped",
    scan_type: "",
    pickrr_sub_status_code: "",
  },
  139: {
    status: "Reverse Pickup Canceled",
    pickrr_status: "Not to be mapped",
    scan_type: "",
    pickrr_sub_status_code: "",
  },
  142: {
    status: "RTO Not Delivered",
    pickrr_status: "RTO Undelivered",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  143: {
    status: "Delivery Boy Changed",
    pickrr_status: "Not to be mapped",
    scan_type: "",
    pickrr_sub_status_code: "",
  },
  "114_da-anf": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "114_ud-cna": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "114_da-ia": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "114_cras": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "114_oda": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "114_da-doc": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "114_da-ar": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "114_ph-st": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_cs": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "114_nsp": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_cncr": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "114_ph-nss": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_cnr": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "114_da-pnrdr": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "114_aaic": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_cwod": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "OPDEL",
  },
  "114_marfc": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_selfcoll": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "114_noatt": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_misrou": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_poh": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_pohci": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_csen": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "114_lost": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_delay": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_da-renxtday": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_del-wea": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_cust_ref": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "114_devex": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_refcod": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "114_fudel": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "114_sieze": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "114_idproof": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_reqdept": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_const": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "114_namemis": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_leftj": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_noper": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_nat": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "114_disp": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_nond": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "114_incadd": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "114_cnaacnnr": {
    status: "Delivery re-scheduled",
    pickrr_status: "Failed Attempt at Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
};

const PUSH_PARTITION_COUNT = 10;
const PUSH_GROUP_NAME = "parceldo-push-group";
const PUSH_TOPIC_NAME = "parceldo_push";
module.exports = {
  PARCELDO_CODE_MAPPER,
  PUSH_PARTITION_COUNT,
  PUSH_GROUP_NAME,
  PUSH_TOPIC_NAME,
};

const PARCELDO_CODE_MAPPER = {
  102: {
    status: "Shipment Pickup in Process",
    pickrrStatus: "Out for pickup",
    scanType: "OFP",
    pickrrSubStatusCode: "",
  },
  103: {
    status: "Received at location",
    pickrrStatus: "Shipped",
    scanType: "SHP",
    pickrrSubStatusCode: "",
  },
  104: {
    status: "Received at location",
    pickrrStatus: "Shipped",
    scanType: "SHP",
    pickrrSubStatusCode: "",
  },
  105: {
    status: "Inbound scan",
    pickrrStatus: "Shipped",
    scanType: "SHP",
    pickrrSubStatusCode: "",
  },
  106: {
    status: "Manifest Scan",
    pickrrStatus: "Order in Transit",
    scanType: "OT",
    pickrrSubStatusCode: "",
  },
  107: {
    status: "Outbound Scan",
    pickrrStatus: "Order in Transit",
    scanType: "OT",
    pickrrSubStatusCode: "",
  },
  108: {
    status: "Inscanned Bags, Awaiting Manifest",
    pickrrStatus: "Order in Transit",
    scanType: "OT",
    pickrrSubStatusCode: "",
  },
  109: {
    status: "Outbound Scan",
    pickrrStatus: "Order in Transit",
    scanType: "OT",
    pickrrSubStatusCode: "",
  },
  110: {
    status: "Out for Delivery",
    pickrrStatus: "Order Out for Delivery",
    scanType: "OO",
    pickrrSubStatusCode: "",
  },
  111: {
    status: "Delivered",
    pickrrStatus: "Order Delivered/Order Returned to Seller",
    scanType: "DL/RTD",
    pickrrSubStatusCode: "",
  },
  112: {
    status: "Undelivered package, please contact your local WLA Branch",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  113: {
    status: "Undelivered package, please contact your local WLA Branch",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_DA-ANF": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "AI",
  },
  "114_UD-CNA": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CNA",
  },
  "114_DA-IA": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "AI",
  },
  "114_CRAS": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CR",
  },
  "114_ODA": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "ODA",
  },
  "114_DA-DOC": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CNA",
  },
  "114_DA-AR": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "REST",
  },
  "114_PH-ST": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_CS": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "AI",
  },
  "114_NSP": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_CNCR": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CNA",
  },
  "114_PH-NSS": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_CNR": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CNR",
  },
  "114_DA-PNRDR": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CD",
  },
  "114_AAIC": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_CWOD": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "OPDEL",
  },
  "114_MARFC": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_SELFCOLL": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "ODA",
  },
  "114_NOATT": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_MISROU": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_POH": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_POHCI": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_CSEN": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "OTH",
  },
  "114_LOST": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_DELAY": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_DA-RENXTDAY": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_DEL-WEA": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_CUST_REF": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CR",
  },
  "114_DEVEX": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_REFCOD": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CNR",
  },
  "114_FUDEL": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CD",
  },
  "114_SIEZE": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "SD",
  },
  "114_IDPROOF": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_REQDEPT": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_CONST": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "REST",
  },
  "114_NAMEMIS": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_LEFTJ": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_NOPER": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_NAT": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "OTH",
  },
  "114_DISP": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_NOND": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CI",
  },
  "114_INCADD": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CNA",
  },
  "114_CNAACNNR": {
    status: "Delivery re-scheduled",
    pickrrStatus: "Failed Attempt at Delivery",
    scanType: "UD",
    pickrrSubStatusCode: "CNA",
  },
  117: {
    status: "Return To Origin",
    pickrrStatus: "Order Returned Back",
    scanType: "RTO",
    pickrrSubStatusCode: "",
  },
  121: {
    status: "Return Delivered",
    pickrrStatus: "Order Returned to Seller",
    scanType: "RTD",
    pickrrSubStatusCode: "",
  },
  122: {
    status: "Shipment Received At Facility",
    pickrrStatus: "Order in Transit",
    scanType: "OT",
    pickrrSubStatusCode: "",
  },
  123: {
    status: "Shipment Forwarded To Destination",
    pickrrStatus: "Order in Transit",
    scanType: "OT",
    pickrrSubStatusCode: "",
  },
  124: {
    status: "Data Received",
    pickrrStatus: "Order Placed",
    scanType: "OP",
    pickrrSubStatusCode: "",
  },
  125: {
    status: "Return To Origin Initiated",
    pickrrStatus: "Order Returned Back",
    scanType: "RTO",
    pickrrSubStatusCode: "",
  },
  126: {
    status: "Address Change Shipment Redirect",
    pickrrStatus: "Order in Transit",
    scanType: "OT",
    pickrrSubStatusCode: "",
  },
  127: {
    status: "Shipment Manifest Generated",
    pickrrStatus: "Order Manifested",
    scanType: "OM",
    pickrrSubStatusCode: "",
  },
  133: {
    status: "Shipment Picked",
    pickrrStatus: "Order Picked Up",
    scanType: "PP",
    pickrrSubStatusCode: "",
  },
  134: {
    status: "Pickup Initiated",
    pickrrStatus: "Out for pickup",
    scanType: "OFP",
    pickrrSubStatusCode: "",
  },
  136: {
    status: "Pickup Completed",
    pickrrStatus: "Out for pickup",
    scanType: "OFP",
    pickrrSubStatusCode: "",
  },
  137: {
    status: "Reached at Destination",
    pickrrStatus: "Reached at Destination",
    scanType: "RAD",
    pickrrSubStatusCode: "",
  },
  138: {
    status: "Pending Child Order Data",
    pickrrStatus: "Not to be mapped",
    scanType: "",
    pickrrSubStatusCode: "",
  },
  139: {
    status: "Reverse Pickup Canceled",
    pickrrStatus: "Not to be mapped",
    scanType: "",
    pickrrSubStatusCode: "",
  },
  142: {
    status: "RTO Not Delivered",
    pickrrStatus: "RTO Undelivered",
    scanType: "RTO UD",
    pickrrSubStatusCode: "",
  },
  143: {
    status: "Delivery Boy Changed",
    pickrrStatus: "Not to be mapped",
    scanType: "",
    pickrrSubStatusCode: "",
  },
};

const PARCELDO_TOPICS_COUNT = 1;

module.exports = {
  PARCELDO_CODE_MAPPER,
  PARCELDO_TOPICS_COUNT,
};

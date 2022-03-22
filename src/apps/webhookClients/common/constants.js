const TRACKING_INFO_PARENT_KEYS = [
  "order_type",
  "client_order_id",
  "courier_tracking_id",
  "courier_used",
  "company_name",
  "web_address",
  "logo",
  "edd_stamp",
  "err",
  "product_name",
  "client_extra_var",
  "length",
  "breadth",
  "height",
  "weight",
  "pickrr_order_id",
  "item_list",
  "billing_zone",
  "dispatch_mode",
  "is_reverse",
  "quantity",
  "hsn_code",
  "item_tax_percentage",
  "sku",
  "courier_parent_name",
  "info",
  "auth_token",
  "track_arr",
  "status",
];

const GET_TRACK_INFO_KEYS = [
  "cod_amount",
  "invoice_value",
  "to_name",
  "to_email",
  "to_address",
  "to_pincode",
  "to_phone_number",
  "to_city",
  "from_city",
  "from_pincode",
  "courier_name",
  "is_open_ndr",
  "to_state",
  "from_state",
  "from_email",
  "from_address",
  "from_name",
  "source_address_id",
  "to_address_id",
  "from_phone_number",
];

const NEW_STATUS_TO_OLD_MAPPING = {
  OFP: "OP",
  PPF: "OM",
  LT: "OT",
  "RTO-OO": "RTO",
  "RTO-OT": "RTO",
  DM: "OT",
  RAD: "OT",
  SHP: "OT",
  SD: "OT",
  UD: "OT",
};

const PICKRR_STATUS_CODE_MAPPING = {
  OP: "Order Placed",
  OM: "Order Manifested",
  OC: "Order Cancelled",
  PP: "Order Picked Up",
  OD: "Order Dispatched",
  OT: "Order in Transit",
  OO: "Order Out for Delivery",
  NDR: "Failed Attempt at Delivery",
  DL: "Order Delivered",
  RTO: "Order Returned Back",
  "RTO-OT": "RTO in Transit",
  "RTO-OO": "RTO out for delivery",
  RTP: "RTO Reached Pickrr Warehouse",
  RTD: "Order Returned to Consignee",
  OFP: "Out for pickup",
  PPF: "Pickup Failed",
  SHP: "Shipped",
  RAD: "Reached at Destination",
  LT: "Shipment Lost",
  DM: "Shipment Damaged",
  "RTO UD": "RTO Undelivered",
  UD: "Undelivered",
};

const REMOVE_ELEMENT_KEYS = [
  "_id",
  "auth_token",
  "created_at",
  "updated_at",
  "order_created_at",
  "audit",
  "pp_sent",
  "dl_sent",
  "rto_sent",
  "rtd_sent",
  "mandatory_status_map",
  "label_logo",
  "user_email",
  "shp_sent",
  "rad_sent",
  "oo_sent",
  "woocom_platform_obj",
  "wh_id",
  "waybill_type",
  "shop_platform_obj",
  "shop_platform",
  "sales_poc",
  "pdd_date",
  "ops_profile",
  "last_update_from",
  "kam",
  "err",
  "client_extra_var",
];
module.exports = {
  TRACKING_INFO_PARENT_KEYS,
  GET_TRACK_INFO_KEYS,
  NEW_STATUS_TO_OLD_MAPPING,
  PICKRR_STATUS_CODE_MAPPING,
  REMOVE_ELEMENT_KEYS,
};

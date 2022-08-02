const PARTITON_COUNT = 10;
const PICKRR_CONNECT_TOPIC_NAME = "pickrr_connect";
const PICKRR_CONNECT_GROUP_NAME = "pickrr_connect_group";
const UNUSED_FIELDS_FROM_TRACKING_OBJ = [
  "audit",
  "mandatory_status_map",
  "woocom_platform_obj",
  "shop_platform_obj",
  "shop_platform",
  "pdd_date",
  "kam",
  "client_extra_var",
  "sales_poc",
  "is_mps",
  "last_update_from",
  "ops_profile",
  "hsn_code",
  "err",
];

module.exports = {
  PARTITON_COUNT,
  PICKRR_CONNECT_TOPIC_NAME,
  PICKRR_CONNECT_GROUP_NAME,
  UNUSED_FIELDS_FROM_TRACKING_OBJ,
};

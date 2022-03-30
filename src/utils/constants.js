const {
  ELASTICO_ID,
  ELASTICO_USERNAME,
  ELASTICO_PASSWORD,
  STAGING_ELASTICO_ID,
  STAGING_ELASTICO_USERNAME,
  STAGING_ELASTICO_PASSWORD,
  TRACKING_ELASTICO_ID,
  TRACKING_ELASTICO_USERNAME,
  TRACKING_ELASTICO_PASSWORD,
} = process.env;

const BLOCKED_IPS = ["54.179.209.160"];

const ALLOWED_IPS = [
  "3.110.95.224",
  "13.233.11.82",
  "13.233.62.47",
  "65.0.101.215",
  "15.206.206.191",
];
const VALIDATE_VIA_AUTH_TOKEN = true;
const IS_FETCH_FROM_DB = false;

const HOST_NAMES = {
  PULL_DB: "PULL_DB",
  REPORT_DB: "REPORT_DB",
  PULL_STATING_DB: "PULL_STATING_DB",
};

const ELK_INSTANCE_NAMES = {
  PROD: {
    name: "PROD",
    config: {
      elasticoid: ELASTICO_ID,
      username: ELASTICO_USERNAME,
      password: ELASTICO_PASSWORD,
    },
  },
  STAGING: {
    name: "STAGING",
    config: {
      elasticoid: STAGING_ELASTICO_ID,
      username: STAGING_ELASTICO_USERNAME,
      password: STAGING_ELASTICO_PASSWORD,
    },
  },
  TRACKING: {
    name: "TRACKING",
    config: {
      elasticoid: TRACKING_ELASTICO_ID,
      username: TRACKING_ELASTICO_USERNAME,
      password: TRACKING_ELASTICO_PASSWORD,
    },
  },
};

const COURIER_PARENT_TO_CHILD_MAPPER = {
  DTDC: ["dtdc", "dtdc_air", "dtdc_docs_100", "dtdc_docs_250"],
  BLUEDART: [
    "bluedart",
    "bluedart_dart_plus",
    "bluedart_air_zookr",
    "bluedart_dg_zookr",
    "bluedart_ras_ncr",
    "bluedart_ras_external",
    "bluedart_air_yn_mumbai_chen_hyd_bang",
  ],
  FEDEX: ["fedex", "fedex_po", "fedex_economy", "fedex_so", "fedex_3kg", "fedex_3kg_surface"],
  "INDIA POST": ["india_post"],
  "SHREE MARUTI COURIER": ["maruti"],
  "FIRST FLIGHT": ["firstflight"],
  PROFESSIONAL: ["professional"],
  DELHIVERY: [
    "delhivery",
    "delhivery_express",
    "delhivery_non_est",
    "delhivery_air",
    "delhivery_bulk",
    "delhivery_air_zookr",
    "delhivery_dg_zookr",
    "weshyp_delhivery_air_bulk",
    "weshyp_delhivery_air_express",
    "weshyp_delhivery_express",
    "delhivery_heavy",
    "delhivery_heavy_mps",
    "delhivery_bulk_mps",
    "delhivery_ncr_mps",
    "delhivery_5kg",
    "delhivery_5kg_mps",
    "delhivery_docs",
    "delhivery_20kg",
  ],
  OVERNITE: ["overnite"],
  GOJAVAS: ["gojavas"],
  ARAMEX: ["aramex"],
  NECC: ["NECC"],
  DOTZOT: ["dotzot", "dotzot_zookr"],
  HOLISOL: ["holisol"],
  INNOVEX: ["innovex"],
  VELEX: ["velex"],
  WEDIB: ["wedib"],
  XPRESSBEES: [
    "xpressbees",
    "xpressbees_non_est",
    "xpressbees_zookr",
    "xpressbees_weshyp",
    "weshyp_xpressbees",
    "xpressbees_2kg",
    "xpressbees_5kg",
    "xpressbees_10kg",
    "xpressbees_20kg",
    "xpressbees_otp",
    "xpressbees_air",
    "xpressbees_docs",
  ],
  "ECOM EXPRESS": ["ecommexpress", "ecommexpress_ras", "ecomm_new", "ecommexpress_premium"],
  BOOKMYPACKET: ["bmp_surface", "bookmypacket", "bookmypacket_zookr"],
  "VULCAN COURIER": ["vulcan_courier"],
  EKART: ["ekart", "ekart_new", "ekart_new_non_est", "ekart_new_surface"],
  SHADOWFAX: ["shadowfax", "shadowfax_bulk"],
  KERRYINDEV: ["kerry_indev", "kerry_docs"],
  PARCELDO: ["parceldo", "parceldo_sdd"],
  MILESAWAY: ["milesaway"],
  DVCEXPRESS: ["dvcexpress"],
  AMAZE: ["amaze"],
  "AMAZE DOCS": ["amaze_docs"],
  "UDAAN EXPRESS": ["udaan", "udaan_b2b"],
  PIDGE: ["pidge"],
};

const WEBHOOK_USER_CACHE_KEY_NAME = "webhookUser";

const DEFAULT_REQUESTS_TIMEOUT = 10;

module.exports = {
  BLOCKED_IPS,
  ALLOWED_IPS,
  VALIDATE_VIA_AUTH_TOKEN,
  IS_FETCH_FROM_DB,
  HOST_NAMES,
  WEBHOOK_USER_CACHE_KEY_NAME,
  ELK_INSTANCE_NAMES,
  DEFAULT_REQUESTS_TIMEOUT,
  COURIER_PARENT_TO_CHILD_MAPPER,
};

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

const REDIS_CONFIG = {
  sentinels: [
    { host: "redis-0.prod.internal", port: 26379 },
    { host: "redis-1.prod.internal", port: 26379 },
    { host: "redis-2.prod.internal", port: 26379 },
  ],
  name: process.env.MASTER_NAME,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  sentinelPassword: process.env.SENTINEL_PASSWORD,
  db: process.env.DB_NUMBER,
  maxRetriesPerRequest: 1,
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

const KAFKA_INSTANCE_CONFIG = {
  PROD: {
    name: "PROD",
    config: {
      brokerUrl: process.env.KAFKA_BROKER_URL,
      username: process.env.KAFKA_USER_NAME,
      password: process.env.KAFKA_PASSWORD,
      clientId: process.env.KAFKA_CLIENT_ID,
    },
  },
  STAGING: {
    name: "STAGING",
    config: {
      brokerUrl: process.env.STAGING_KAFKA_BROKER_URL,
      username: process.env.STAGING_KAFKA_USER_NAME,
      password: process.env.STAGING_KAFKA_PASSWORD,
      clientId: process.env.STAGING_KAFKA_CLIENT_ID,
    },
  },
};

const NDR_STATUS_CODE_TO_REASON_MAPPER = {
  CR: "Customer Refused Shipment",
  CNA: "Customer Not Available/Office/Residence Closed/Consignee phone not reachable",
  AI: "Address Issue",
  CD: "Customer Delay/Future Delivery",
  REST: "Entry Restricted Area",
  "CR-OTP": "Customer Refused Shipment- OTP Verified",
  ODA: "Out of Delivery area",
  CNR: "Cash Not Ready",
  OPDEL: "Conignee wants open delivery",
  OTH: "Other",
  CI: "Customer Issue",
  SD: "Shipper Delay",
  OTPF: "OTP Validation Failed",
};

const TOPIC_NAME_TO_COURIER_NAME_MAPPER = {
  amaze: ["Amaze", "Amaze Docs"],
  bluedart: ["BLUEDART"],
  bluedart_pull: ["BLUEDART"],
  delhivery: ["Delhivery"],
  delhivery_pull: ["Delhivery"],
  ecomm: ["Ecom Express"],
  ekart: ["Ekart"],
  ekart_pull: ["Ekart"],
  parceldo: ["ParcelDo"],
  shadowfax: ["ShadowFax", "ShadowFax SDD", "ShadowFax NDD"],
  shadowfax_pull: ["ShadowFax", "ShadowFax SDD", "ShadowFax NDD"],
  udaan: ["Udaan Express"],
  xpressbees: ["Xpressbees"],
  xpressbees_pull: ["Xpressbees"],
  pidge: ["Pidge", "Pidge Ndd", "Pidge External"],
  pidge_pull: ["Pidge", "Pidge Ndd", "Pidge External"],
  dtdc: ["DTDC"],
  dtdc_pull: ["DTDC"],
  loadshare: ["Loadshare", "Loadshare SDD"],
  loadshare_pull: ["Loadshare", "Loadshare SDD"],
  pikndel: ["Pickndel"],
  pikndel_pull: ["Pickndel"],
  smartr: ["Smartr Logistics"],
  smartr_pull: ["Smartr Logistics"],
  kerryindev_pull: ["Kerry Ndd", "KerryIndev", "Kerry Sdd"],
  holisol_pull: ["Holisol"],
}

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
  KAFKA_INSTANCE_CONFIG,
  REDIS_CONFIG,
  NDR_STATUS_CODE_TO_REASON_MAPPER,
  TOPIC_NAME_TO_COURIER_NAME_MAPPER,
};

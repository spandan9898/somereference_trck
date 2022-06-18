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
};

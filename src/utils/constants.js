const {
  ELASTICO_ID,
  ELASTICO_USERNAME,
  ELASTICO_PASSWORD,
  STAGING_ELASTICO_ID,
  STAGING_ELASTICO_USERNAME,
  STAGING_ELASTICO_PASSWORD,
} = process.env;

const BLOCKED_IPS = ["54.179.209.160"];

const ALLOWED_IPS = ["13.233.11.82", "13.233.62.47", "65.0.101.215", "15.206.206.191"];
const VALIDATE_VIA_AUTH_TOKEN = true;
const IS_FETCH_FROM_DB = false;

const HOST_NAMES = {
  PULL_DB: "PULL_DB",
  REPORT_DB: "REPORT_DB",
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
};

const WEBHOOK_USER_CACHE_KEY_NAME = "webhookUser";

module.exports = {
  BLOCKED_IPS,
  ALLOWED_IPS,
  VALIDATE_VIA_AUTH_TOKEN,
  IS_FETCH_FROM_DB,
  HOST_NAMES,
  WEBHOOK_USER_CACHE_KEY_NAME,
  ELK_INSTANCE_NAMES,
};

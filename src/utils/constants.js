const {
  ELASTICO_ID,
  ELASTICO_USERNAME,
  ELASTICO_PASSWORD,
  STAGING_ELASTICO_ID,
  STAGING_ELASTICO_USERNAME,
  STAGING_ELASTICO_PASSWORD,
} = process.env;

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
  HOST_NAMES,
  WEBHOOK_USER_CACHE_KEY_NAME,
  ELK_INSTANCE_NAMES,
};

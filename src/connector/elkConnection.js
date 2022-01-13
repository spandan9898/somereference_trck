/* eslint-disable class-methods-use-this */
const { Client } = require("@elastic/elasticsearch");
const logger = require("../../logger");

const { ELASTICO_ID, ELASTICO_USERNAME, ELASTICO_PASSWORD } = process.env;

/**
 * @param
 * @desc Initialize Multiple ELK and get ELK instances
 */
class InitELK {
  constructor() {
    this.instances = {};
  }

  /**
   *
   * @param {*} config, instanceName
   * @desc instanceName -> like PROD/STAGING/others
   * @format {elasticoid, username, password }
   */
  connectELK(instanceName, config) {
    const {
      elasticoid = ELASTICO_ID,
      username = ELASTICO_USERNAME,
      password = ELASTICO_PASSWORD,
    } = config;
    if (this.instances[instanceName]) {
      return this.instances[instanceName];
    }
    const elkClient = new Client({
      cloud: {
        id: elasticoid,
      },
      auth: {
        username,
        password,
      },
    });
    logger.info(`${instanceName} ELK Connected`);
    this.instances[instanceName] = elkClient;
    return this.instances[instanceName];
  }

  getElkInstance(instanceName) {
    if (!this.instances[instanceName]) {
      throw new Error(`${instanceName} not found. Please Connect to ELK First`);
    }
    return this.instances[instanceName];
  }
}

module.exports = new InitELK();

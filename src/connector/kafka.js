const { Kafka, logLevel } = require("kafkajs");

const logger = require("../../logger");
const { toWinstonLogLevel } = require("../../logger/helper");

/**
 *
 * @param {*} logLevel
 * @desc custom logger for kafka
 * @returns
 */
const WinstonLogCreator = (logLevelVaue) => {
  logger.level = toWinstonLogLevel(logLevelVaue);

  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log;
    if (level === 1) {
      logger.error(`${label} [${namespace}] ${message}`, extra);
    } else if (process.env.NODE_ENV !== "production" && level === 4) {
      logger.verbose(`${label} [${namespace}] ${message} ${JSON.stringify(extra)}`);
    }
  };
};

/**
 * @param
 * @desc Initialize Multiple Kafka and get instances
 */
class InitKafka {
  constructor() {
    this.instances = {};
  }

  /**
   *
   * @param {*} config, instanceName
   * @desc instanceName -> like PROD/STAGING/others
   * @config { brokerUrl, username, password, clientId }
   */
  connect(instanceName, config) {
    const {
      brokerUrl = process.env.KAFKA_BROKER_URL,
      username = process.env.KAFKA_USER_NAME,
      password = process.env.KAFKA_PASSWORD,
      clientId = process.env.KAFKA_CLIENT_ID,
    } = config;
    if (this.instances[instanceName]) {
      return this.instances[instanceName];
    }
    const sasl = username && password ? { username, password, mechanism: "plain" } : null;
    const ssl = !!sasl;

    const kafkaClient = new Kafka({
      brokers: [brokerUrl],
      ssl,
      sasl,
      clientId,
      retry: {
        maxRetryTime: 10,
      },
      authenticationTimeout: 10000,
      logCreator: WinstonLogCreator,
      logLevel: logLevel.DEBUG,
    });
    if (!kafkaClient) {
      logger.error(`${instanceName} Kafka Connection Error`);
    }
    this.instances[instanceName] = kafkaClient;
    logger.info(`${instanceName} Kafka Connected`);
    return this.instances[instanceName];
  }

  getInstance(instanceName) {
    if (!this.instances[instanceName]) {
      throw new Error(`${instanceName} not found. Please Connect to Kafka First`);
    }
    return this.instances[instanceName];
  }
}

module.exports = new InitKafka();

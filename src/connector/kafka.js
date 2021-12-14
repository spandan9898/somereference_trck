const { Kafka, logLevel } = require("kafkajs");
const logger = require("../../logger");
const { toWinstonLogLevel } = require("../../logger/helper");

const {
  KAFKA_USERNAME: username,
  KAFKA_PASSWORD: password,
  KAFKA_BROKER_URL: brokerUrl,
} = process.env;
const sasl = username && password ? { username, password, mechanism: "plain" } : null;
const ssl = !!sasl;

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
    } else if (process.env.NODE_ENV !== "production") {
      console.log("----");
      console.log(`${label} [${namespace}] ${message} ${JSON.stringify(extra)}`);
      console.log("----");
    }
  };
};

const kafka = new Kafka({
  brokers: [brokerUrl],
  ssl,
  sasl,
  retry: {
    maxRetryTime: 10,
  },
  authenticationTimeout: 10000,
  logCreator: WinstonLogCreator,
  logLevel: logLevel.DEBUG,
});

module.exports = kafka;

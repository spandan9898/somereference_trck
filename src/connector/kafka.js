const { Kafka } = require("kafkajs");

const {
  KAFKA_USERNAME: username,
  KAFKA_PASSWORD: password,
  KAFKA_BROKER_URL: brokerUrl,
} = process.env;
const sasl = username && password ? { username, password, mechanism: "plain" } : null;
const ssl = !!sasl;

const kafka = new Kafka({
  brokers: [brokerUrl],
  ssl,
  sasl,
});

module.exports = kafka;

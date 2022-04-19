const logger = require("../../logger");
const kafkaInstance = require("../connector/kafka");

/**
 * @param
 * @desc Initialize Multiple Producer and get instances
 */
class InitProducer {
  constructor() {
    this.instances = {};
  }

  async connect(instanceName) {
    if (this.instances[instanceName]) {
      return this.instances[instanceName];
    }
    try {
      const kafka = kafkaInstance.getInstance(instanceName);
      const producer = kafka.producer({
        retry: {
          maxRetryTime: 10,
        },
      });
      await producer.connect();
      this.instances[instanceName] = producer;
      logger.info(`${instanceName} Producer Connected`);
      return this.instances[instanceName];
    } catch (error) {
      logger.error("Kafka Producer connection error -->", error);
      return false;
    }
  }

  async getInstance(instanceName) {
    if (!this.instances[instanceName]) {
      throw new Error(`${instanceName} not found. Please Initialize Producer First`);
    }
    return this.instances[instanceName];
  }
}

module.exports = new InitProducer();

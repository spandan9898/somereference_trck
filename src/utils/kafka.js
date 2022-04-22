const { CompressionTypes } = require("kafkajs");

const logger = require("../../logger");
const { MakeAPICall } = require("./helpers");

/**
 *
 * @desc call Push Producer API
 */
const sendErrorData = async ({ topic, messages }) => {
  try {
    const URL = `${process.env.PUSH_PRODUCER_URL}/common/produce/${topic}`;
    const apiCall = new MakeAPICall(URL, { body: messages });
    await apiCall.post();
  } catch (error) {
    logger.error("sendErrorData", error.message);
  }
};

/**
 *
 * @desc multiple data producer
 */
const produceData = async ({ topic, producer, messages }) => {
  try {
    await producer.send({
      compression: CompressionTypes.GZIP,
      topic,
      messages,
    });

    return true;
  } catch (error) {
    logger.error("produceData error", error.message);
    sendErrorData({ topic, messages });
    return false;
  }
};

module.exports = { produceData };

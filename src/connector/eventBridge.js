const AWS = require("aws-sdk");
const logger = require("../../logger");

const { ACCESS_KEY, SECRET_KEY } = process.env;
const config = {
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
};

/**
 *
 * sending data to event Bridge
 * @desc -
 * source - Will get this during bus creation and same as DetailType
 * data - data that to be send to destination api
 * eventBusName - EB name - ARN of event bus rule
 * @returns
 */
const sendDataToEventBridge = async ({ source, detailType, data, eventBusName }) => {
  try {
    const input = [
      {
        Source: source,
        DetailType: detailType,
        Detail: JSON.stringify(data),
        EventBusName: eventBusName,
      },
    ];
    const eventBridge = new AWS.EventBridge({
      credentials: config,
      region: "ap-south-1",
      maxRetries: 3,
    });

    eventBridge.putEvents({ Entries: input }, (err, responseData) => {
      if (err) logger.error("sendDataToEventBridge Put Events err ->", err, err.stack);
      logger.verbose(`responseData eventBridge:`);
      logger.verbose(responseData);
    });
  } catch (error) {
    logger.error("sendDataToEventBridge err", error);
    throw new Error(error);
  }
};

module.exports = sendDataToEventBridge;

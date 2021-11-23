const AWS = require("aws-sdk");

const { ACCESS_KEY, SECRET_KEY } = process.env;
const config = {
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
};

/**
 *
 * sending data to event Bridge
 * @desc source - Event Bridge source detail , detailType
 * data - data that to be send to destination api
 * eventBusName - EB name (all should be from .env file)
 *
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
    });
    eventBridge.putEvents({ Entries: input }, (err, response) => {
      if (err) console.log(err, err.stack);
      else console.log(response);
    });
  } catch (error) {
    console.error("error", error);
    throw new Error(error);
  }
};

module.exports = sendDataToEventBridge;

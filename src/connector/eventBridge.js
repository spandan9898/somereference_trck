const AWS = require("aws-sdk");

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
      maxRetries: 2,
    });
    eventBridge.putEvents({ Entries: input }, (err, response) => {
      if (err) console.log("err ->", err, err.stack);
      else console.log("response", response);
    });
  } catch (error) {
    console.error("error", error);
    throw new Error(error);
  }
};

module.exports = sendDataToEventBridge;

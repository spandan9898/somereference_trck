const AWS = require("aws-sdk");
const logger = require("../../logger");

const { ACCESS_KEY_2, SECRET_KEY_2 } = process.env;
const config = {
  accessKeyId: ACCESS_KEY_2,
  secretAccessKey: SECRET_KEY_2,
};

const lambda = new AWS.Lambda({
  credentials: config,
  region: "ap-south-1",
  maxRetries: 3,
});

/**
 *
 * @param {*} data
 */
const callLambdaFunction = async (data, functionName) => {
  try {
    const params = {
      FunctionName: functionName || "kafkaWebhookTriggerV2",
      InvocationType: "Event",
      Payload: JSON.stringify(data),
    };
    const lambdaRequestObj = lambda.invoke(params);
    lambdaRequestObj.on("error", (response) => {
      logger.error(`${functionName} lambda trigger error`, response);
    });
    lambdaRequestObj.on("success", () => {
      logger.verbose(`${functionName} Lambda Success`);
    });
    lambdaRequestObj.send();
  } catch (error) {
    logger.error(`${functionName} callLambdaFunction`, error);
  }
};

module.exports = {
  callLambdaFunction,
};

const AWS = require("aws-sdk");
const logger = require("../../logger");

const { ACCESS_KEY, SECRET_KEY } = process.env;
const config = {
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
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
      FunctionName: functionName || "kafkaWebhookTrigger",
      InvocationType: "Event",
      Payload: JSON.stringify(data),
    };
    const lambdaRequestObj = lambda.invoke(params);
    lambdaRequestObj.on("error", (response) => {
      logger.error("lambda trigger error", response.error.message);
    });
    lambdaRequestObj.on("complete", () => {
      logger.verbose("Complete");
    });
    lambdaRequestObj.send();
  } catch (error) {
    logger.error("callLambdaFunction", error);
  }
};

module.exports = {
  callLambdaFunction,
};

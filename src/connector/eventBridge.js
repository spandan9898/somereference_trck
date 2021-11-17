const AWS = require("aws-sdk");

const eventBridge = new AWS.EventBridge({
  accessKeyId: "AKIAXQKRCRZEL6XQ4HTA",
  secretAccessKey: "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",
  region: "ap-south-1",
});

module.exports = eventBridge;

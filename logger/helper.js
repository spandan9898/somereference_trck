const { format, transports } = require("winston");

const { printf } = format;

const SlackHook = require("./slackHook");

/**
 *
 * @desc slack message formatter
 */
const customSlackFormatter = ({ message, timestamp: loggerTimestamp, ...metadata }) => {
  const codeText = `\`\`\` ${JSON.stringify(metadata)} \`\`\``;
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${loggerTimestamp} | ${message}`,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: codeText,
        },
      },
    ],
  };
};

const options = {
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const loggerTransports = [new transports.Console(options.console)];

if (process.env.NODE_ENV === "production") {
  loggerTransports.push(
    new SlackHook({
      webhookUrl: process.env.SLACK_TRACKING_ERROR_WEBHOOK_URL,
      formatter: customSlackFormatter,
    })
  );
}

const customFormat = printf(({ level, message, timestamp: loggerTimestamp, ...metadata }) => {
  let msg = `${loggerTimestamp} [${level}] : ${message} `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

module.exports = {
  customFormat,
  loggerTransports,
};

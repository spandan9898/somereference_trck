const { createLogger, format, transports } = require("winston");
const SlackHook = require("./slackHook");

const { combine, splat, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp: loggerTimestamp, ...metadata }) => {
  let msg = `${loggerTimestamp} [${level}] : ${message} `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

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

const logger = createLogger({
  level: "debug",
  format: combine(splat(), timestamp({ format: "MMM-DD-YYYY hh:mm:ss" }), customFormat),
  transports: [
    new transports.Console(options.console),
    new SlackHook({
      webhookUrl: process.env.SLACK_TRACKING_ERROR_WEBHOOK_URL,
      formatter: customSlackFormatter,
    }),
  ],
});

module.exports = logger;

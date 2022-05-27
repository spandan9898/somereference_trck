/* eslint-disable no-constant-condition */
const { format, transports } = require("winston");
const { logLevel } = require("kafkajs");
const isEmpty = require("lodash/isEmpty");

const { printf, combine } = format;

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

const alignColorsAndTime = format.combine(
  format.colorize({
    all: true,
  }),
  format.label({
    label: "[LOGGER]",
  }),
  format.timestamp({
    format: "YY-MM-DD HH:MM:SS",
  }),
  format.printf((info) => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`)
);
const loggerTransports = [
  new transports.Console({
    format: combine(format.colorize(), alignColorsAndTime),
  }),
];

if (["production", "staging"].includes(process.env.NODE_ENV) && false) {
  loggerTransports.push(
    new SlackHook({
      webhookUrl: process.env.SLACK_TRACKING_ERROR_WEBHOOK_URL,
      formatter: customSlackFormatter,
    })
  );
}

const customFormat = printf(({ level, message, timestamp: loggerTimestamp, ...metadata }) => {
  let msg = `${loggerTimestamp} [${level}] : ${message} `;
  if (!isEmpty(metadata)) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

/**
 *
 * @param {*} level
 * @returns
 */
const toWinstonLogLevel = (level) => {
  switch (level) {
    case logLevel.WARN:
      return "warn";
    case logLevel.INFO:
      return "info";
    case logLevel.DEBUG:
      return "debug";
    default:
      return "error";
  }
};

module.exports = {
  customFormat,
  loggerTransports,
  toWinstonLogLevel,
};

const { createLogger, format, addColors, transports } = require("winston");

const { combine, splat, timestamp } = format;
const { customFormat, loggerTransports } = require("./helper");

addColors({
  error: "bold underline red",
  warn: "yellow",
  info: "green",
  verbose: "cyan",
  debug: "green",
});

const logger = createLogger({
  level: "debug",
  format: combine(splat(), timestamp({ format: "MMM-DD-YYYY hh:mm:ss" }), customFormat),
  transports: loggerTransports,
});
const fileLogger = createLogger({
  level: "debug",
  format: format.json(),
  transports: [new transports.File({ filename: "unhandled_rejection.log" })],
});

module.exports = logger;
exports = module.exports;
exports.fileLogger = fileLogger;

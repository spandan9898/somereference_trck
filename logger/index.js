const { createLogger, format, addColors } = require("winston");

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

module.exports = logger;

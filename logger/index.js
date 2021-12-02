const { createLogger, format } = require("winston");

const { combine, splat, timestamp } = format;
const { customFormat, loggerTransports } = require("./helper");

const logger = createLogger({
  level: "debug",
  format: combine(splat(), timestamp({ format: "MMM-DD-YYYY hh:mm:ss" }), customFormat),
  transports: loggerTransports,
});

module.exports = logger;

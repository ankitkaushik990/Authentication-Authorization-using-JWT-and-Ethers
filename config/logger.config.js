const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize({ all: true, colors: { info: "cyan" } }),
        format.colorize(), // Apply colorize format to add colors to log messages
        format.simple()
      ),
    }),
    new transports.File({
      filename: "./logger/info.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: "./logger/info.log",
      level: "info",
      format: format.combine(format.timestamp(), format.simple()),
    }),
    new transports.File({
      filename: "./logger/error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.simple()),
    }),
    new transports.File({
      filename: "./logger/warn.log",
      level: "warn",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;

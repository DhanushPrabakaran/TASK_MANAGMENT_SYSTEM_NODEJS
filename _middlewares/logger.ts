import winston from "winston";

const { combine, timestamp, printf, colorize, align } = winston.format;

const customFormat = printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    align(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/app.log",
      level: "error", // Only error-level logs
    }),
  ],
});

if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info", // Log all info-level and above
    })
  );
}

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.Console(),
  new winston.transports.File({ filename: "logs/exceptions.log" })
);

// Handle unhandled rejections
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

export default logger;

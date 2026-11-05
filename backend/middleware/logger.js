const fs = require("fs");
const path = require("path");

const logsDirectory = path.join(__dirname, "../logs");
const logFile = path.join(logsDirectory, "app.log");

// Vercel has a read-only application filesystem.
// File logging is used locally; Vercel uses console logging.
const isVercel = process.env.VERCEL === "1";

if (!isVercel && !fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const logger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    const logEntry =
      `[${timestamp}] ${req.method} ${req.originalUrl} ` +
      `Status: ${res.statusCode} Duration: ${duration}ms`;

    // Always log to console
    console.log(logEntry);

    // Save logs to a file only when running locally
    if (!isVercel) {
      fs.appendFile(logFile, logEntry + "\n", (error) => {
        if (error) {
          console.error("Logging error:", error.message);
        }
      });
    }
  });

  next();
};

module.exports = logger;
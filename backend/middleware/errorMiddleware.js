const multer = require("multer");

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error(
    `[${new Date().toISOString()}] ERROR: ${err.message}`
  );

  // Multer file-size and other upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Profile picture must not exceed 2 MB"
      });
    }

    return res.status(400).json({
      success: false,
      message: "File upload failed"
    });
  }

  // Invalid file type from uploadMiddleware
  if (err.statusCode === 400) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message
  });
};

module.exports = {
  notFound,
  errorHandler
};

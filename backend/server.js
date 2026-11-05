const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const logger = require("./middleware/logger");

const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Security middleware.
// Allow profile images served by this API to be displayed by the React frontend.
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Request logging middleware
app.use(logger);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded profile pictures
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "COMP3123 Assignment 2 API",
    student: "Alia Qureshi",
    studentNumber: "101535665"
  });
});

// Health-check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running"
  });
});

// User routes
app.use("/api/v1/user", userRoutes);

// Employee routes
app.use("/api/v1/emp", employeeRoutes);

// Handle unsupported routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

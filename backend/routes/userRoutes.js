const express = require("express");

const {
  signup,
  login
} = require("../controllers/userController");

const {
  signupValidator,
  loginValidator
} = require("../validators/userValidator");

const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
  "/signup",
  authLimiter,
  signupValidator,
  signup
);

router.post(
  "/login",
  authLimiter,
  loginValidator,
  login
);

module.exports = router;
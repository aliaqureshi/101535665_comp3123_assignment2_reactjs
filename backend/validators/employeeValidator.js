const { body, param, query } = require("express-validator");

const employeeValidator = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("position")
    .trim()
    .notEmpty()
    .withMessage("Position is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Position must be between 2 and 100 characters"),

  body("salary")
    .notEmpty()
    .withMessage("Salary is required")
    .isFloat({ min: 0 })
    .withMessage("Salary must be a positive number"),

  body("date_of_joining")
    .notEmpty()
    .withMessage("Date of joining is required")
    .isISO8601()
    .withMessage("Date of joining must be a valid date"),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Department must be between 2 and 100 characters")
];

const employeeIdParamValidator = [
  param("eid")
    .notEmpty()
    .withMessage("Employee ID is required")
    .isMongoId()
    .withMessage("Employee ID must be a valid MongoDB ObjectId")
];

const employeeIdQueryValidator = [
  query("eid")
    .notEmpty()
    .withMessage("Employee ID is required")
    .isMongoId()
    .withMessage("Employee ID must be a valid MongoDB ObjectId")
];

module.exports = {
  employeeValidator,
  employeeIdParamValidator,
  employeeIdQueryValidator
};
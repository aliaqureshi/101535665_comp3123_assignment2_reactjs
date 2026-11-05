const express = require("express");

const {
  createEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  employeeValidator,
  employeeIdParamValidator,
  employeeIdQueryValidator,
  employeeSearchValidator
} = require("../validators/employeeValidator");

const router = express.Router();

// Get all employees owned by authenticated user
router.get(
  "/employees",
  protect,
  getAllEmployees
);

// Create employee with optional profile picture
router.post(
  "/employees",
  protect,
  upload.single("profile_picture"),
  employeeValidator,
  createEmployee
);

// Search employees by department and/or position.
// IMPORTANT: Keep this route before /employees/:eid.
router.get(
  "/employees/search",
  protect,
  employeeSearchValidator,
  searchEmployees
);

// Get one employee
router.get(
  "/employees/:eid",
  protect,
  employeeIdParamValidator,
  getEmployeeById
);

// Update employee with optional profile picture
router.put(
  "/employees/:eid",
  protect,
  employeeIdParamValidator,
  upload.single("profile_picture"),
  employeeValidator,
  updateEmployee
);

// Delete employee using the required ?eid= query parameter
router.delete(
  "/employees",
  protect,
  employeeIdQueryValidator,
  deleteEmployee
);

module.exports = router;

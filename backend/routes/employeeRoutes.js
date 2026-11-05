const express = require("express");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");

const {
  employeeValidator,
  employeeIdParamValidator,
  employeeIdQueryValidator
} = require("../validators/employeeValidator");

const router = express.Router();

router.get(
  "/employees",
  protect,
  getAllEmployees
);

router.post(
  "/employees",
  protect,
  employeeValidator,
  createEmployee
);

router.get(
  "/employees/:eid",
  protect,
  employeeIdParamValidator,
  getEmployeeById
);

router.put(
  "/employees/:eid",
  protect,
  employeeIdParamValidator,
  employeeValidator,
  updateEmployee
);

router.delete(
  "/employees",
  protect,
  employeeIdQueryValidator,
  deleteEmployee
);

module.exports = router;
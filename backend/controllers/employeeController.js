const { validationResult } = require("express-validator");
const Employee = require("../models/Employee");

const createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const {
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department
    } = req.body;

    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
      user: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee
    });
  } catch (error) {
    console.error("Create employee error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      user: req.user.id
    }).sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    console.error("Get employees error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const employee = await Employee.findById(req.params.eid);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    if (employee.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this employee"
      });
    }

    return res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    console.error("Get employee by ID error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const employee = await Employee.findById(req.params.eid);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    if (employee.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this employee"
      });
    }

    const {
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department
    } = req.body;

    employee.first_name = first_name;
    employee.last_name = last_name;
    employee.email = email;
    employee.position = position;
    employee.salary = salary;
    employee.date_of_joining = date_of_joining;
    employee.department = department;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    console.error("Update employee error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const employee = await Employee.findById(req.query.eid);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    if (employee.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this employee"
      });
    }

    await employee.deleteOne();

    return res.status(204).send();
  } catch (error) {
    console.error("Delete employee error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
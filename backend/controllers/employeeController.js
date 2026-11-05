const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Employee = require("../models/Employee");

// Escape special RegExp characters from user-controlled search input
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Safely remove an uploaded profile picture.
const removeProfilePicture = (profilePicture) => {
  if (!profilePicture) {
    return;
  }

  const filename = path.basename(profilePicture);
  const filePath = path.join(__dirname, "../uploads", filename);

  fs.unlink(filePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.error("Profile picture cleanup error:", error.message);
    }
  });
};

// Remove a newly uploaded file when the request cannot be completed.
const cleanupNewUpload = (req) => {
  if (req.file) {
    removeProfilePicture(`/uploads/${req.file.filename}`);
  }
};

const createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      cleanupNewUpload(req);

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

    const profile_picture = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
      profile_picture,
      user: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee
    });
  } catch (error) {
    cleanupNewUpload(req);

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

const searchEmployees = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { department, position } = req.query;

    // Ownership is always enforced server-side.
    const searchQuery = {
      user: req.user.id
    };

    if (department) {
      searchQuery.department = {
        $regex: escapeRegex(department.trim()),
        $options: "i"
      };
    }

    if (position) {
      searchQuery.position = {
        $regex: escapeRegex(position.trim()),
        $options: "i"
      };
    }

    const employees = await Employee.find(searchQuery).sort({
      created_at: -1
    });

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    console.error("Search employees error:", error.message);

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

    if (employee.user.toString() !== req.user.id.toString()) {
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
      cleanupNewUpload(req);

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const employee = await Employee.findById(req.params.eid);

    if (!employee) {
      cleanupNewUpload(req);

      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    if (employee.user.toString() !== req.user.id.toString()) {
      cleanupNewUpload(req);

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

    const oldProfilePicture = employee.profile_picture;

    employee.first_name = first_name;
    employee.last_name = last_name;
    employee.email = email;
    employee.position = position;
    employee.salary = salary;
    employee.date_of_joining = date_of_joining;
    employee.department = department;

    if (req.file) {
      employee.profile_picture = `/uploads/${req.file.filename}`;
    }

    await employee.save();

    if (
      req.file &&
      oldProfilePicture &&
      oldProfilePicture !== employee.profile_picture
    ) {
      removeProfilePicture(oldProfilePicture);
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    cleanupNewUpload(req);

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

    if (employee.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this employee"
      });
    }

    const profilePicture = employee.profile_picture;

    await employee.deleteOne();

    if (profilePicture) {
      removeProfilePicture(profilePicture);
    }

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
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};

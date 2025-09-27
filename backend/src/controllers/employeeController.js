const EmployeeService = require('../services/employeeService');
const { validationResult } = require('express-validator');

class EmployeeController {
  // Get all employees
  static async getAllEmployees(req, res, next) {
    try {
      const { search } = req.query;
      const employees = await EmployeeService.getAllEmployees(search);
      
      res.status(200).json({
        success: true,
        data: employees,
        count: employees.length,
        message: search ? `Found ${employees.length} employees matching "${search}"` : 'Employees retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get employee by ID
  static async getEmployeeById(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await EmployeeService.getEmployeeById(id);
      
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found`
        });
      }
      
      res.status(200).json({
        success: true,
        data: employee,
        message: 'Employee retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Create new employee
  static async createEmployee(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { name, email, position } = req.body;
      
      // Check if email already exists
      const emailExists = await EmployeeService.checkEmailExists(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'An employee with this email already exists'
        });
      }
      
      const employee = await EmployeeService.createEmployee({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        position: position.trim()
      });
      
      res.status(201).json({
        success: true,
        data: employee,
        message: 'Employee created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Update employee
  static async updateEmployee(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      const { name, email, position } = req.body;
      
      // Check if employee exists
      const existingEmployee = await EmployeeService.getEmployeeById(id);
      if (!existingEmployee) {
        return res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found`
        });
      }
      
      // Check if email is taken by another employee
      const emailExists = await EmployeeService.checkEmailExists(email, id);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Another employee with this email already exists'
        });
      }
      
      const updatedEmployee = await EmployeeService.updateEmployee(id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        position: position.trim()
      });
      
      res.status(200).json({
        success: true,
        data: updatedEmployee,
        message: 'Employee updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Delete employee
  static async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;
      
      // Check if employee exists
      const existingEmployee = await EmployeeService.getEmployeeById(id);
      if (!existingEmployee) {
        return res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found`
        });
      }
      
      const deleted = await EmployeeService.deleteEmployee(id);
      
      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'Employee deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete employee'
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController;
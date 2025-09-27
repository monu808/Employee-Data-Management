const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const { 
  validateCreateEmployee, 
  validateUpdateEmployee, 
  validateEmployeeId 
} = require('../middleware/validation');

const router = express.Router();

// GET /api/employees - Get all employees (with optional search)
router.get('/', EmployeeController.getAllEmployees);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', validateEmployeeId, EmployeeController.getEmployeeById);

// POST /api/employees - Create new employee
router.post('/', validateCreateEmployee, EmployeeController.createEmployee);

// PUT /api/employees/:id - Update employee
router.put('/:id', validateUpdateEmployee, EmployeeController.updateEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', validateEmployeeId, EmployeeController.deleteEmployee);

module.exports = router;
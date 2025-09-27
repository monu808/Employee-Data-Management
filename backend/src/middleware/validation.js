const { body, param } = require('express-validator');

// Validation rules for creating an employee
const validateCreateEmployee = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, apostrophes, and hyphens'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters')
];

// Validation rules for updating an employee
const validateUpdateEmployee = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Employee ID must be a positive integer'),
  
  ...validateCreateEmployee
];

// Validation rules for getting employee by ID
const validateEmployeeId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Employee ID must be a positive integer')
];

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId
};
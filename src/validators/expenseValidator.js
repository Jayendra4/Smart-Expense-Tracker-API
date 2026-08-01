const { body } = require('express-validator');

const createExpenseRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
    
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .withMessage('Category must be a string'),
    
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date string')
];

module.exports = {
  createExpenseRules
};

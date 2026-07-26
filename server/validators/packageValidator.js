const { body } = require('express-validator');

const createPackageRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('availableSeats')
    .notEmpty()
    .withMessage('Available seats is required')
    .isInt({ min: 0 })
    .withMessage('Available seats must be a positive integer'),
  body('departureDate')
    .notEmpty()
    .withMessage('Departure date is required')
    .isISO8601()
    .withMessage('Departure date must be a valid date'),
  body('returnDate')
    .notEmpty()
    .withMessage('Return date is required')
    .isISO8601()
    .withMessage('Return date must be a valid date'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

const updatePackageRules = [
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('availableSeats')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available seats must be a positive integer'),
  body('departureDate')
    .optional()
    .isISO8601()
    .withMessage('Departure date must be a valid date'),
  body('returnDate')
    .optional()
    .isISO8601()
    .withMessage('Return date must be a valid date'),
];

module.exports = { createPackageRules, updatePackageRules };

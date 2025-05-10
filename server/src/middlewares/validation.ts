// server/src/middlewares/validation.ts
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { LoanStatus, LoanType } from '../models/Application';

// Validation middleware for creating a new loan application
export const validateApplicationCreate = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Full name must be between 3 and 100 characters'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
    
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9()\-\s+]+$/).withMessage('Invalid phone number format'),
    
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
    
  body('loanAmount')
    .notEmpty().withMessage('Loan amount is required')
    .isNumeric().withMessage('Loan amount must be a number')
    .custom((value) => {
      if (value < 100) {
        throw new Error('Loan amount must be at least 100');
      }
      return true;
    }),
    
  body('loanType')
    .notEmpty().withMessage('Loan type is required')
    .isIn(Object.values(LoanType)).withMessage('Invalid loan type'),
    
  body('loanPurpose')
    .trim()
    .notEmpty().withMessage('Loan purpose is required')
    .isLength({ min: 10, max: 500 }).withMessage('Loan purpose must be between 10 and 500 characters'),
    
  body('employmentStatus')
    .trim()
    .notEmpty().withMessage('Employment status is required'),
    
  body('monthlyIncome')
    .notEmpty().withMessage('Monthly income is required')
    .isNumeric().withMessage('Monthly income must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Monthly income cannot be negative');
      }
      return true;
    }),
    
  body('creditScore')
    .notEmpty().withMessage('Credit score is required')
    .isInt({ min: 300, max: 850 }).withMessage('Credit score must be between 300 and 850'),
    
  // Process validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.mapped()
      });
    }
    
    next();
  }
];

// Validation middleware for updating application status
export const validateStatusUpdate = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(Object.values(LoanStatus)).withMessage('Invalid status value'),
    
  // Process validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.mapped()
      });
    }
    
    next();
  }
];
// server/src/routes/dashboardRoutes.ts
import express from "express";
import {
  getDashboardStats,
  getLoanTypeStats,
  getMonthlyStats,
  getApprovalTrends,
  getTopMetrics,
} from "../controllers/dashboardController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { query } from "express-validator";

const router = express.Router();

// Validation middleware for query parameters
const validateMonthsQuery = [
  query("months")
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage("Months must be a number between 1 and 24")
    .toInt(),
];

const validateDateRangeQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date"),
];

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Public (can be protected later)
router.get("/stats", asyncHandler(getDashboardStats));

// @route   GET /api/dashboard/loan-types
// @desc    Get loan type statistics
// @access  Public (can be protected later)
router.get("/loan-types", asyncHandler(getLoanTypeStats));

// @route   GET /api/dashboard/monthly
// @desc    Get monthly statistics
// @access  Public (can be protected later)
router.get("/monthly", validateMonthsQuery, asyncHandler(getMonthlyStats));

// @route   GET /api/dashboard/approval-trends
// @desc    Get approval trends over time
// @access  Public (can be protected later)
router.get(
  "/approval-trends",
  validateDateRangeQuery,
  asyncHandler(getApprovalTrends)
);

// @route   GET /api/dashboard/top-metrics
// @desc    Get top performing metrics (highest loan amounts, best credit scores, etc.)
// @access  Public (can be protected later)
router.get("/top-metrics", asyncHandler(getTopMetrics));

export default router;

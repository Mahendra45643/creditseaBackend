// server/src/routes/applicationRoutes.ts
import express from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/applicationController';
import { validateApplicationCreate, validateStatusUpdate } from '../middlewares/validation';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = express.Router();

// Routes for /api/applications
router.post('/', validateApplicationCreate, asyncHandler(createApplication));
router.get('/', asyncHandler(getApplications));
router.get('/:id', asyncHandler(getApplicationById));
router.patch('/:id/status', validateStatusUpdate, asyncHandler(updateApplicationStatus));
router.delete('/:id', asyncHandler(deleteApplication));

export default router;
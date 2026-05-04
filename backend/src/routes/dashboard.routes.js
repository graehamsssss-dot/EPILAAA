import express from 'express';
import {
  getDashboardAnalytics,
  getDashboardSummary
} from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/summary', authenticate, authorizeRoles('admin'), getDashboardSummary);
router.get('/analytics', authenticate, authorizeRoles('admin'), getDashboardAnalytics);

export default router;
import express from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/summary', authenticate, authorizeRoles('admin'), getDashboardSummary);

export default router;
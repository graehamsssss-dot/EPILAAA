import express from 'express';
import { getReports } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getReports);

export default router;
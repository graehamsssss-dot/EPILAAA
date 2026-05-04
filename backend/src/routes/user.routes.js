import express from 'express';
import {
  getCurrentUserProfile,
  updateAdminProfile
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/me/profile', authenticate, getCurrentUserProfile);
router.put('/admin/profile', authenticate, authorizeRoles('admin'), updateAdminProfile);

export default router;
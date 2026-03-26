import express from 'express';
import { getQueue, updateQueueStatus } from '../controllers/queue.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getQueue);
router.patch('/:id/status', authenticate, authorizeRoles('admin'), updateQueueStatus);

export default router;
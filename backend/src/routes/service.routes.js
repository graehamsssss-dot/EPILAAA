import express from 'express';
import {
  createService,
  deleteService,
  getServiceAvailability,
  getServices,
  updateService
} from '../controllers/service.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, getServices);
router.get('/:id/availability', authenticate, getServiceAvailability);

router.post('/', authenticate, authorizeRoles('admin'), createService);
router.put('/:id', authenticate, authorizeRoles('admin'), updateService);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteService);

export default router;
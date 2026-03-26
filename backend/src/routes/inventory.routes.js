import express from 'express';
import {
  createInventoryItem,
  getInventory,
  updateInventoryItem
} from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getInventory);
router.post('/', authenticate, authorizeRoles('admin'), createInventoryItem);
router.put('/:id', authenticate, authorizeRoles('admin'), updateInventoryItem);

export default router;
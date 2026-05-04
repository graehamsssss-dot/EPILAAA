import express from 'express';
import {
  archiveInventoryItem,
  createInventoryItem,
  getInventory,
  getInventoryLogs,
  restockInventoryItem,
  updateInventoryItem
} from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getInventory);
router.get('/logs', authenticate, authorizeRoles('admin'), getInventoryLogs);
router.post('/', authenticate, authorizeRoles('admin'), createInventoryItem);
router.put('/:id', authenticate, authorizeRoles('admin'), updateInventoryItem);
router.patch('/:id/restock', authenticate, authorizeRoles('admin'), restockInventoryItem);
router.patch('/:id/archive', authenticate, authorizeRoles('admin'), archiveInventoryItem);

export default router;
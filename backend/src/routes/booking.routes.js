import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking
} from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/my', authenticate, authorizeRoles('patient'), getMyBookings);
router.post('/', authenticate, authorizeRoles('patient'), createBooking);
router.patch('/:id/cancel', authenticate, authorizeRoles('patient'), cancelBooking);

export default router;
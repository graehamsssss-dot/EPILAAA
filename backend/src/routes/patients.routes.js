import express from 'express';
import { getPatientProfile, updatePatientProfile } from '../controllers/patient.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/profile', authenticate, authorizeRoles('patient'), getPatientProfile);
router.put('/profile', authenticate, authorizeRoles('patient'), updatePatientProfile);

export default router;
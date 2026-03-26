import express from 'express';
import { login, me, registerPatient } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerPatient);
router.post('/login', login);
router.get('/me', authenticate, me);

export default router;
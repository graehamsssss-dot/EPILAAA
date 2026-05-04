import express from 'express';
import {login, me, registerPatient,changePassword} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerPatient);
router.post('/login', login);
router.get('/me', authenticate, me);
router.patch('/change-password', authenticate, changePassword);

export default router;
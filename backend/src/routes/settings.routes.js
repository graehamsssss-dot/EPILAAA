import express from 'express';
import { getSettings, saveSetting } from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getSettings);
router.post('/', authenticate, saveSetting);

export default router;
import express from 'express';
import { getUserNotifications } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/notifications', protect, getUserNotifications);

export default router;

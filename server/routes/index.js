import express from 'express';
import userRoutes from './userRoute.js';
import taskRoutes from './taskRoute.js';
import leaderboardRoutes from './leaderboardRoute.js';
import statusRoutes from './StatusRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/status', statusRoutes);

export default router;

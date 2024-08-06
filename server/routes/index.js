import express from 'express';
import userRoutes from './userRoute.js';
import taskRoutes from './taskRoute.js';
import leaderboardRoutes from './leaderboardRoute.js'; // Import leaderboard routes
import statusRoutes from './StatusRoutes.js'; // Import status routes

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/status', statusRoutes);

export default router;

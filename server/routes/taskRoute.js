import express from 'express';
import Task from '../models/taskModel.js'; // Correct path to taskModel
import User from '../models/userModel.js'; // Correct path to userModel
import Achievement from '../models/Achievement.js';
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  updateTaskStage,
  completeTask, // Import the new completeTask controller
} from '../controllers/taskController.js';
import { isAdminRoute, protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protectRoute, isAdminRoute, createTask);
router.post('/duplicate/:id', protectRoute, isAdminRoute, duplicateTask);
router.post('/activity/:id', protectRoute, postTaskActivity);

router.get('/dashboard', protectRoute, dashboardStatistics);
router.get('/', protectRoute, getTasks);
router.get('/:id', protectRoute, getTask);

router.put('/create-subtask/:id', protectRoute, isAdminRoute, createSubTask);
router.put('/update/:id', protectRoute, isAdminRoute, updateTask);
router.put('/change-stage/:id', protectRoute, updateTaskStage);
router.put('/:id', protectRoute, isAdminRoute, trashTask);
router.put('/complete/:id', protectRoute, completeTask); // Add the new complete task route

router.delete(
  '/delete-restore/:id?',
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;

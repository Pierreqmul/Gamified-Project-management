import express from "express";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  getUserById,
  loginUser,
  logoutUser,
  markNotificationRead,
  getLeaderboard,
  registerUser,
  updateUserProfile,
  completeTask,
  getStreak, // Import the getStreak controller function
} from "../controllers/userController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);
router.get('/:id', getUserById);

// New route for getting the user's streak count
router.get('/streak', protectRoute, getStreak);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

// New route for completing a task and adding points to the user
router.put('/tasks/:taskId/complete', protectRoute, completeTask);

// FOR ADMIN ONLY - ADMIN ROUTES
router
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;

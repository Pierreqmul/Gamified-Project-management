import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";
import Notice from "../models/notis.js";
import Task from "../models/taskModel.js"; // New import for Task model

// Function to update the user's daily streak
const updateStreak = async (user) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastLogin = new Date(user.lastLoginDate).setHours(0, 0, 0, 0);

  if (user.lastLoginDate) {
    const diffDays = (today - lastLogin) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      user.streakCount += 1;
      // Trigger toast for increasing streak if using frontend framework
    } else if (diffDays > 1) {
      user.streakCount = 1;
    }
  } else {
    user.streakCount = 1;
  }
  user.lastLoginDate = new Date();
  await user.save();
};

// POST request - login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password." });
  }

  if (!user?.isActive) {
    return res.status(401).json({
      status: false,
      message: "User account has been deactivated, contact the administrator",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (user && isMatch) {
    createJWT(res, user._id);
    
    await updateStreak(user); // Update streak after successful login

    user.password = undefined;

    res.status(200).json(user);
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password" });
  }
});

const getStreak = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ streakCount: user.streakCount });
};

// POST - Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin, role, title } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ status: false, message: "Email address already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
    role,
    title,
    points: 0 // Initialize points field
  });

  if (user) {
    isAdmin ? createJWT(res, user._id) : null;

    user.password = undefined;

    res.status(201).json(user);
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user data" });
  }
});

// POST - Logout user / clear cookie
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// GET - Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email points');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET - Get team list
const getTeamList = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  const user = await User.find(query).select("name title role email isActive");

  res.status(201).json(user);
});
// GET - Get user notifications
const getNotificationsList = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const notice = await Notice.find({
    team: userId,
    isRead: { $nin: [userId] },
  })
    .populate("task", "title")
    .sort({ _id: -1 });

  res.status(201).json(notice);
});

// GET - Mark notification as read
const markNotificationRead = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }
    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
  }
});

// PUT - Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;

  const id =
    isAdmin && userId === _id
      ? userId
      : isAdmin && userId !== _id
      ? _id
      : userId;

  const user = await User.findById(id);

  if (user) {
    user.name = req.body.name || user.name;
    user.title = req.body.title || user.title;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: "Profile Updated Successfully.",
      user: updatedUser,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// PUT - Activate/deactivate user profile
const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (user) {
    user.isActive = req.body.isActive;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `User account has been ${
        user?.isActive ? "activated" : "disabled"
      }`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// PUT - Change user password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (user) {
    user.password = req.body.password;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `Password changed successfully.`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// GET - Get leaderboard
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await User.find({})
    .sort({ points: -1 })
    .select('name points')
    .limit(10);
  res.json(leaderboard);
});

// DELETE - Delete user account
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "User deleted successfully" });
});

// New controller function for completing a task
const completeTask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    // Fetch the task and mark it as completed
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.stage = 'completed';
    task.completed = true;
    await task.save();

    // Add 20 points to the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.points += 20;
    await user.save();

    res.status(200).json({ message: 'Task completed and points added', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getTeamList,
  getUserById,
  loginUser,
  getStreak,
  logoutUser,
  getLeaderboard,
  registerUser,
  updateUserProfile,
  getNotificationsList,
  markNotificationRead,
  completeTask // Include the new export
};


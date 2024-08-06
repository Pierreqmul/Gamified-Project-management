import asyncHandler from 'express-async-handler';
import Notice from '../models/notis.js';

const getUserNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const notifications = await Notice.find({ team: userId, isRead: { $nin: [userId] } }).populate('task', 'title');
  res.status(200).json(notifications);
});

export { getUserNotifications };

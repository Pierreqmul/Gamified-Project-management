import User from '../models/userModel.js';

export const getLeaderboard = async (req, res) => {
  try {
    // Fetch all users from the database and sort them by points in descending order
    const users = await User.find({}).sort({ points: -1 });

    // Transform data if necessary
    const leaderboardData = users.map(user => ({
      _id: user._id,
      name: user.name,
      points: user.points,
    }));

    // Send sorted leaderboard data as response
    res.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

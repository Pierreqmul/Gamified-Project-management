import axios from 'axios';

// Fetch user data
export const fetchUser = async (userId) => {
  const response = await axios.get(`/api/users/${userId}`);
  return response.data;
};

// Fetch leaderboard
export const fetchLeaderboard = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};

// Complete task
export const completeTask = async (taskId) => {
  const response = await axios.post(`/api/tasks/${taskId}/complete`);
  return response.data;
};

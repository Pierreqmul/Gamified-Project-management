import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../api';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      const leaderboardData = await fetchLeaderboard();
      setUsers(leaderboardData);
    };
    getLeaderboard();
  }, []);

  return (
    <div>
      <h3>Leaderboard</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaderDashboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className='w-full bg-white p-4 rounded shadow-sm mt-8'>
      <h4 className='text-xl text-gray-500 font-bold mb-2'>Leaderboard</h4>
      <table className='w-full mb-5'>
        <thead className='border-b border-gray-300 dark:border-gray-600'>
          <tr className='text-black dark:text-white text-left'>
            <th className='py-2'>Rank</th>
            <th className='py-2'>Name</th>
            <th className='py-2'>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr
              key={user._id}
              className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'
            >
              <td className='py-2'>{index + 1}</td>
              <td className='py-2'>{user.name}</td>
              <td className='py-2'>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderDashboard;

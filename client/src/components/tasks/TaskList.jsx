import React, { useEffect, useState } from 'react';
import { useCompleteTaskMutation, useGetAllTaskQuery } from '../../redux/slices/api/taskApiSlice';

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const { data: tasksData, refetch } = useGetAllTaskQuery({
    strQuery: '',
    isTrashed: false,
    search: ''
  });
  const [completeTask] = useCompleteTaskMutation();

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData]);

  const handleComplete = async (taskId) => {
    try {
      await completeTask({ userId, id: taskId }).unwrap();
      refetch(); // Refresh task list after completion
    } catch (err) {
      console.error('Failed to complete the task: ', err);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title} - {task.points} points
            {!task.completed && (
              <button onClick={() => handleComplete(task._id)}>Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

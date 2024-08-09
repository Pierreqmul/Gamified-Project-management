import React, { useEffect, useState } from 'react';
import { useCompleteTaskMutation, useGetAllTaskQuery } from '../../redux/slices/api/taskApiSlice';
import { List, Button, Typography, Space, message } from 'antd';

const { Title } = Typography;

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
      message.success('Task completed successfully!');
      refetch(); // Refresh task list after completion
    } catch (err) {
      console.error('Failed to complete the task: ', err);
      message.error('Failed to complete the task.');
    }
  };

  return (
    <div>
      <Title level={2}>Tasks</Title>
      <List
        itemLayout="horizontal"
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item
            actions={[
              !task.completed && (
                <Button type="primary" onClick={() => handleComplete(task._id)}>
                  Complete
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              title={task.title}
              description={`${task.points} points`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default TaskList;

import { Task, TaskStatus } from '../models/taskModel.js';

const calculateTaskStats = async () => {
  const totalTasks = await Task.countDocuments();
  const todoCount = await Task.countDocuments({ stage: 'todo' });
  const inProgressCount = await Task.countDocuments({ stage: 'in progress' });
  const completedCount = await Task.countDocuments({ stage: 'completed' });

  const todoPercentage = (todoCount / totalTasks) * 100;
  const inProgressPercentage = (inProgressCount / totalTasks) * 100;
  const completedPercentage = (completedCount / totalTasks) * 100;

  const taskStatus = await TaskStatus.findOne({});
  if (taskStatus) {
    taskStatus.todoCount = todoCount;
    taskStatus.inProgressCount = inProgressCount;
    taskStatus.completedCount = completedCount;
    taskStatus.todoPercentage = todoPercentage;
    taskStatus.inProgressPercentage = inProgressPercentage;
    taskStatus.completedPercentage = completedPercentage;
    await taskStatus.save();
  } else {
    await TaskStatus.create({
      todoCount,
      inProgressCount,
      completedCount,
      todoPercentage,
      inProgressPercentage,
      completedPercentage,
    });
  }
};

export default calculateTaskStats;

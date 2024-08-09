import { IoMdAdd } from "react-icons/io";
import { Typography, Button } from "antd";
import TaskColor from "./TaskColor";

const { Text } = Typography;

const TaskTitle = ({ label, className, onClick }) => {
  return (
    <div className='w-full h-10 md:h-12 px-2 md:px-4 rounded bg-white dark:bg-[#1f1f1f] flex items-center justify-between shadow-sm'>
      <div className='flex gap-2 items-center'>
        <TaskColor className={className} />
        <Text className='text-sm md:text-base text-gray-600 dark:text-gray-300'>
          {label}
        </Text>
      </div>

      <Button 
        type="text" 
        icon={<IoMdAdd className='text-lg text-black dark:text-gray-300' />} 
        onClick={onClick} 
        style={{ display: 'none', md: 'block' }}
      />
    </div>
  );
};

export default TaskTitle;

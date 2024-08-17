import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Loading, Title } from "../components/index";
import { AddTask } from "../components/tasks";
import { useGetAllTaskQuery, useUpdateTaskMutation } from "../redux/slices/api/taskApiSlice";
import { useSelector } from "react-redux";
import KanbanBoard from "../components/tasks/KanbanBoard"; 

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");
  const [open, setOpen] = useState(false);
  
  const status = params?.status || "";
  
  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchTerm,
  });
  
  const [updateTaskStage] = useUpdateTaskMutation();
  
  const handleStageChange = async (taskId, newStage) => {
    try {
      await updateTaskStage({ id: taskId, stage: newStage }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update task stage", error);
    }
  };

  useEffect(() => {
    refetch();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [refetch]);

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />
        
        {!status && user?.isAdmin && (
          <Button
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <KanbanBoard tasks={data?.tasks} onTaskUpdate={handleStageChange} />
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;

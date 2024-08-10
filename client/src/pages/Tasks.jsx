import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Loading, CustomTabs, Title, Table } from "../components/index";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import { useGetAllTaskQuery, useUpdateTaskMutation } from "../redux/slices/api/taskApiSlice";
import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";

  // Fetch tasks data
  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchTerm,
  });

  // Mutation hook for updating task stage
  const [updateTaskStage] = useUpdateTaskMutation();

  // Handle stage change for a task
  const handleStageChange = async (taskId, newStage) => {
    try {
      await updateTaskStage({ id: taskId, stage: newStage }).unwrap();
      refetch(); // Refetch data to reflect changes
    } catch (error) {
      console.error("Failed to update task stage", error);
    }
  };

  useEffect(() => {
    refetch(); // Initial fetch to get tasks
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

      <div>
        <CustomTabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
              <TaskTitle label='To Do' className={TASK_TYPE.todo} />
              <TaskTitle
                label='In Progress'
                className={TASK_TYPE["in progress"]}
              />
              <TaskTitle label='Completed' className={TASK_TYPE.completed} />
            </div>
          )}

          <div className="scrollable-container">
            {selected === 0 ? (
              <BoardView tasks={data?.tasks} onStageChange={handleStageChange} />
            ) : (
              <Table tasks={data?.tasks} onStageChange={handleStageChange} />
            )}
          </div>
        </CustomTabs>
      </div>
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;

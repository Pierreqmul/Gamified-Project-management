import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { useSelector } from "react-redux";
import { Card, Button, Avatar, Tag, Divider, Typography } from "antd";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils/index.js";
import UserInfo from "../UserInfo.jsx";
import { AddSubTask, TaskAssets, TaskColor, TaskDialog } from "./index";

const { Text } = Typography;

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="w-full h-fit shadow-md"
        style={{ backgroundColor: "#fff", borderRadius: 8 }}
        bodyStyle={{ padding: "16px" }}
      >
        <div className="w-full flex justify-between items-center">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <Text className="uppercase">{task?.priority} Priority</Text>
          </div>
          <TaskDialog task={task} />
        </div>

        <Divider className="my-2" />

        <div className="flex items-center gap-2">
          <TaskColor className={TASK_TYPE[task.stage]} />
          <Text className="text-base font-medium text-black dark:text-white">
            {task?.title}
          </Text>
        </div>

        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(new Date(task?.date))}
        </Text>

        <Divider className="my-2" />

        <div className="flex items-center justify-between mb-2">
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks?.length}
            assets={task?.assets?.length}
          />

          <div className="flex flex-row-reverse">
            {task?.team?.length > 0 &&
              task?.team?.map((m, index) => (
                <Avatar
                  key={index}
                  style={{
                    backgroundColor: BGS[index % BGS?.length],
                    marginLeft: -8,
                  }}
                  className="flex items-center justify-center text-sm"
                >
                  <UserInfo user={m} />
                </Avatar>
              ))}
          </div>
        </div>

        {task?.subTasks?.length > 0 ? (
          <div className="py-4">
            <Text className="text-base line-clamp-1 text-black dark:text-gray-400">
              {task?.subTasks[0].title}
            </Text>
            <div className="p-4 space-x-8">
              <Text className="text-sm text-gray-600 dark:text-gray-500">
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </Text>
              <Tag color="blue">{task?.subTasks[0]?.tag}</Tag>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <Text className="text-gray-500">No Sub-Task</Text>
          </div>
        )}

        <Button
          type="dashed"
          icon={<IoMdAdd className="text-lg" />}
          onClick={() => setOpen(true)}
          className="w-full mt-2"
          disabled={!user.isAdmin}
        >
          Add Subtask
        </Button>
      </Card>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;

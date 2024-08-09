import React from "react";
import { Tooltip } from "antd";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";

const TaskAssets = ({ activities, assets, subTasks }) => {
  return (
    <div className="flex items-center gap-3">
      <Tooltip title="Activities">
        <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
          <BiMessageAltDetail />
          <span>{activities}</span>
        </div>
      </Tooltip>
      <Tooltip title="Assets">
        <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
          <MdAttachFile />
          <span>{assets}</span>
        </div>
      </Tooltip>
      <Tooltip title="Sub-tasks">
        <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
          <FaList />
          <span>0/{subTasks}</span>
        </div>
      </Tooltip>
    </div>
  );
};

export default TaskAssets;

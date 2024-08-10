import React from "react";
import { Tooltip, Button } from "antd";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";

const TaskAssets = ({ activities, assets, subTasks, assetUrls }) => {
  return (
    <div className="flex items-center gap-3">
      <Tooltip title="Activities">
        <div className="flex gap-1 items-center text-sm text-gray-600">
          <BiMessageAltDetail />
          <span>{activities}</span>
        </div>
      </Tooltip>
      <Tooltip title="Assets">
        <div className="flex gap-1 items-center text-sm text-gray-600">
          <MdAttachFile />
          <span>{assets}</span>
        </div>
        {assetUrls && assetUrls.length > 0 && (
          <div className="flex flex-col">
            {assetUrls.map((url, index) => (
              <Button
                key={index}
                type="link"
                href={url}
                download
                className="text-blue-500 text-xs"
              >
                Download {`Asset ${index + 1}`}
              </Button>
            ))}
          </div>
        )}
      </Tooltip>
      <Tooltip title="Sub-tasks">
        <div className="flex gap-1 items-center text-sm text-gray-600">
          <FaList />
          <span>0/{subTasks}</span>
        </div>
      </Tooltip>
    </div>
  );
};

export default TaskAssets;

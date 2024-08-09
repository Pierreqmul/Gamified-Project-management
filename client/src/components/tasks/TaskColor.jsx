import React from "react";
import { Badge } from "antd";

const TaskColor = ({ className }) => {
  return (
    <Badge
      color={className}
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        display: "inline-block",
      }}
    />
  );
};

export default TaskColor;

import React from "react";
import TaskCard from "./TaskCard";
import { Row, Col } from "antd";

const BoardView = ({ tasks }) => {
  // Check if tasks is an array and has elements
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <div>No tasks available</div>; // Handle case where there are no tasks
  }

  return (
    <div className="w-full py-4">
      <Row gutter={[16, 16]}>
        {tasks.map((task) => (
          <Col xs={24} sm={12} md={8} key={task.id}> {/* Ensure unique key */}
            <TaskCard task={task} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BoardView;

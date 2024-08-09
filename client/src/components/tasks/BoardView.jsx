import React from "react";
import TaskCard from "./TaskCard";
import { Row, Col } from "antd";

const BoardView = ({ tasks }) => {
  return (
    <div className="w-full py-4">
      <Row gutter={[16, 16]}>
        {tasks?.map((task, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <TaskCard task={task} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BoardView;

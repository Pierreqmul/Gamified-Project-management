import React from 'react';
import { Card, Col, Row } from 'antd';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks }) => {
  const stages = {
    todo: 'To-Do',
    'in progress': 'In Progress', 
    completed: 'Completed',
  };

  const getTasksByStage = (stage) => tasks.filter((task) => task.stage === stage);

  return (
    <div className="kanban-board">
      <Row gutter={16}>
        {Object.keys(stages).map((stage) => (
          <Col span={8} key={stage}>
            <Card
              title={stages[stage]}
              bordered={false}
              className="kanban-column"
            >
              <div className="kanban-tasks">
                {getTasksByStage(stage).map((task) => (
                  <div 
                    key={task._id || task.id} 
                    className="task-card" 
                    style={{ marginBottom: '16px' }} 
                  >
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KanbanBoard;

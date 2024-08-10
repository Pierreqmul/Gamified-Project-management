import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaNewspaper, FaDotCircle } from "react-icons/fa";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice.js";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useSelector } from "react-redux";
import { Card, Col, Row, Table, Avatar, Tag, Grid } from "antd";
import LeaderDashboard from "./LeaderDashboard.jsx";
import PieChart from '../components/PieChart.jsx';
import Chart from '../components/Chart.jsx';
import Loading from '../components/Loading.jsx';
import UserInfo from '../components/UserInfo.jsx';

const { useBreakpoint } = Grid;

const Dashboard = () => {
  const screens = useBreakpoint();
  const { data, isLoading } = useGetDashboardStatsQuery();
  const { user } = useSelector((state) => state.auth);
  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [user._id]);

  useEffect(() => {
    if (data && data.tasks) {
      const tasks = [
        { type: 'To Do', value: data.tasks.todo || 0 },
        { type: 'In Progress', value: data.tasks['in progress'] || 0 },
        { type: 'Completed', value: data.tasks.completed || 0 },
      ];
      setTasksData(tasks);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  const stats = [
    {
      _id: "1",
      label: "Total Task",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper size={24} />,
      bg: "#1d4ed8",
    },
    {
      _id: "2",
      label: "Completed Task",
      total: data?.tasks?.completed || 0,
      icon: <MdAdminPanelSettings size={24} />,
      bg: "#0f766e",
    },
    {
      _id: "3",
      label: "Task In Progress",
      total: data?.tasks?.['in progress'] || 0,
      icon: <LuClipboardEdit size={24} />,
      bg: "#f59e0b",
    },
    {
      _id: "4",
      label: "To Do",
      total: data?.tasks?.todo || 0,
      icon: <FaDotCircle size={24} />,
      bg: "#be185d",
    },
  ];

  return (
    <div className='h-full py-3' style={{ backgroundColor: 'transparent' }}>
      <Row gutter={[16, 8]}>
        {stats.map(({ icon, bg, label, total }, index) => (
          <Col 
            key={index}
            xs={24} sm={12} md={8} lg={6} xl={4} // Responsive column spans
          >
            <Card className='shadow-md' style={{ height: '120px', borderRadius: '20px', backgroundColor: bg }}>
              <div className='h-full flex flex-col justify-center p-0'>
                <div className='flex items-center justify-center'>
                  <span className='text-2xl font-semibold text-white'>{total}</span>
                  <div className='w-12 h-12 rounded-full flex items-center justify-center text-white'>
                    {icon}
                  </div>
                </div>
                <p className='text-base text-white mt-auto text-center'>{label}</p>
              </div>
            </Card>
          </Col>
        ))}
        <Col
          xs={24} sm={12} md={8} lg={6} xl={8} // Responsive column spans
        >
          <Card className='shadow-md' style={{
            height: '120px',
            borderRadius: '20px',
            backgroundImage: 'url(/src/assets/points5.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className='h-full flex flex-col justify-center p-2'>
              <div>
                <h4 className='text-xl text-white font-bold'>Your Points</h4>
              </div>
              <div className='text-xl font-semibold text-white'>{user.points}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 8]} className='my-10'>
        <Col xs={24} md={12} lg={10} // Responsive column spans
        >
          <Card className='shadow-sm' style={{ height: '100%', borderRadius: '12px' }}>
            <h4 className='text-xl text-gray-700 font-bold mb-2'>Leaderboard</h4>
            <div style={{ maxHeight: screens.md ? '300px' : 'auto', overflowY: screens.md ? 'auto' : 'visible' }}>
              <LeaderDashboard />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={7} // Responsive column spans
        >
          <Card className='shadow-sm' style={{ height: '100%', borderRadius: '12px' }}>
            <h4 className='text-xl text-gray-700 font-bold mb-8 w-auto'>Chart by Priority</h4>
            <Chart data={data?.graphData} />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={7} // Responsive column spans
        >
          <Card className='shadow-sm' style={{ height: '100%', borderRadius: '12px' }}>
            <h4 className='text-xl text-gray-700 font-bold mb-2'>Task Progress</h4>
            <PieChart data={tasksData} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 8]} className='py-0'>
        <Col xs={24} md={12} // Responsive column spans
        >
          <Card className='shadow-sm' style={{ height: '100%', borderRadius: '12px' }}>
            <h4 className='text-xl text-gray-700 font-bold mb-2'>Recent Tasks</h4>
            {data && <TaskTable tasks={data?.last10Task} />}
          </Card>
        </Col>
        <Col xs={24} md={12} // Responsive column spans
        >
          <Card className='shadow-sm' style={{ height: '100%', borderRadius: '12px' }}>
            <h4 className='text-xl text-gray-700 font-bold mb-2'>Users</h4>
            {data && user?.isAdmin && <UserTable users={data?.users} />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const UserTable = ({ users }) => {
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, user) => (
        <div className='flex items-center gap-3'>
          <Avatar style={{ backgroundColor: '#4A90E2' }}>{getInitials(user?.name)}</Avatar>
          <div>
            <p>{user.name}</p>
            <span className='text-xs text-black'>{user?.role}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: isActive => (
        <Tag color={isActive ? 'blue' : 'yellow'}>{isActive ? "Active" : "Disabled"}</Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => (
        <span className='text-base text-gray-600'>
          {moment(createdAt).fromNow()}
        </span>
      )
    }
  ];

  return (
    <Table
      dataSource={users}
      columns={columns}
      pagination={false}
      rowKey={record => record._id}
    />
  );
};

const TaskTable = ({ tasks }) => {
  const { user } = useSelector((state) => state.auth);

  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TASK_STAGE_STYLES = {
    todo: "bg-blue-100",
    "in progress": "bg-yellow-100",
    completed: "bg-green-100",
  };

  const columns = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, task) => (
        <div className='flex items-center gap-2'>
          <div className={clsx("w-4 h-4 rounded-full", TASK_STAGE_STYLES[task.stage])} />
          <p className='text-base text-black dark:text-gray-400'>{task?.title}</p>
        </div>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: priority => (
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[priority])}>
            {ICONS[priority]}
          </span>
          <span className='capitalize'>{priority}</span>
        </div>
      )
    },
    {
      title:'Team',
      dataIndex: 'team',
      key: 'team',
      render: team => (
        <div className='flex'>
          {team.map((m, index) => (
            <Avatar
              key={index}
              style={{ backgroundColor: BGS[index % BGS?.length], marginRight: -8 }}
            >
              {getInitials(m?.name)}
            </Avatar>
          ))}
        </div>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'date',
      key: 'date',
      render: date => (
        <span className='text-base text-gray-600'>
          {moment(date).fromNow()}
        </span>
      )
    }
  ];

  return (
    <Table
      dataSource={tasks}
      columns={columns}
      pagination={false}
      rowKey={record => record._id}
      className={clsx("bg-white dark:bg-[#1f1f1f] shadow-md rounded")}
    />
  );
};

export default Dashboard;

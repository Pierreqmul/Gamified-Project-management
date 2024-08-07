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
import { Card, Col, Row, Table, Avatar, Tag } from "antd";
import LeaderDashboard from "./LeaderDashboard.jsx";
import PieChart from '../components/PieChart.jsx';
import Chart from '../components/Chart.jsx';
import Loading from '../components/Loading.jsx';
import UserInfo from '../components/UserInfo.jsx';

const Dashboard = () => {
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
    <div className='h-full py-4' style={{ backgroundColor: '#FFFFFF' }}>
      <Row gutter={[16, 8]}>
        {stats.map(({ icon, bg, label, total }, index) => (
          <Col span={6} key={index}>
            <Card className='shadow-md' style={{ height: '100px', borderRadius: '12px', backgroundColor: bg }}>
              <div className='h-full flex flex-col justify-between'>
                <div className='flex items-center justify-between'>
                  <span className='text-2xl font-semibold text-white'>{total}</span>
                  <div className='w-12 h-12 rounded-full flex items-center justify-center text-white'>
                    {icon}
                  </div>
                </div>
                <p className='text-base text-white mt-2'>{label}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 8]} className='my-16'>
        <Col span={12}>
          <Card className='shadow-sm' style={{ height: '100%', borderRadius: '12px' }}>
            <h4 className='text-xl text-gray-700 font-bold mb-2'>
              Chart by Priority
            </h4>
            <Chart data={data?.graphData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className='shadow-sm' style={{ height: '100%', borderRadius: '12px' }}>
            <h4 className='text-xl text-gray-700 font-bold mb-2'>
              Task Progress
            </h4>
            <PieChart data={tasksData} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 8]} className='py-8'>
        <Col span={16}>
          {data && <TaskTable tasks={data?.last10Task} />}
        </Col>
        <Col span={8}>
          {data && user?.isAdmin && <UserTable users={data?.users} />}
        </Col>
      </Row>

      <Card className='shadow-sm mt-8' style={{ backgroundColor: '#FFD700', borderRadius: '12px' }}>
        <h4 className='text-xl text-gray-700 font-bold mb-2'>Your Points</h4>
        <div className='text-2xl font-semibold'>{user.points}</div>
      </Card>

      <LeaderDashboard />
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

  const columns = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, task) => (
        <div className='flex items-center gap-2'>
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
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
      title: 'Team',
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

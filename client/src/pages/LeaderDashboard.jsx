import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Avatar } from "antd";
import { UserOutlined, CrownOutlined } from "@ant-design/icons";

const LeaderDashboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record, index) => (
        <span>
          {index === 0 ? <CrownOutlined style={{ color: 'gold' }} /> : null}
          {index === 1 ? <CrownOutlined style={{ color: 'silver' }} /> : null}
          {index === 2 ? <CrownOutlined style={{ color: '#cd7f32' }} /> : null}
          {index + 1}
        </span>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            icon={<UserOutlined />}
          />
          <span style={{ marginLeft: 8 }}>{text}</span>
        </span>
      ),
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
    },
  ];

  const dataSource = leaderboard.map((user, index) => ({
    key: user._id,
    rank: index + 1,
    name: user.name,
    points: user.points,
  }));

  return (
    <Card className='w-full bg-white rounded' style={{ borderRadius: '20px' }}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        style={{ borderRadius: '20px' }}
      />
    </Card>
  );
};

export default LeaderDashboard;

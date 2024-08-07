import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-full'>
      <Spin indicator={antIcon} size="200%" />
    </div>
  );
};

export default Loading;

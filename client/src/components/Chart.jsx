import React from 'react';
import { Bar } from '@ant-design/plots';

const Chart = ({ data }) => {
  const config = {
    data,
    xField: 'total',
    yField: 'name',
    seriesField: 'name',
    legend: {
      position: 'top-left',
    },
    colorField: 'name',
    color: ['#1d4ed8', '#0f766e', '#f59e0b', '#be185d'],
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    height: 270,
  };

  return <Bar {...config} />;
};

export default Chart;

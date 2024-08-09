import React from 'react';
import { Tabs } from 'antd';

export default function CustomTabs({ tabs, setSelected, children }) {
  const items = tabs.map((tab, index) => ({
    key: index.toString(),
    label: (
      <span>
        {tab.icon}
        {tab.title}
      </span>
    ),
    children: children[index],
  }));

  const onChange = (key) => {
    setSelected(parseInt(key, 10));
  };

  return (
    <div className="w-full">
      <Tabs
        defaultActiveKey="0"
        items={items}
        onChange={onChange}
        centered
        tabBarGutter={30}
        tabBarStyle={{ marginBottom: '16px', fontSize: '16px' }}
      />
    </div>
  );
}

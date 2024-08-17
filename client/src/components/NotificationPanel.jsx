import { Popover, List, Button, Badge, Card, Typography } from "antd";
import moment from "moment";
import { useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
} from "../redux/slices/api/userApiSlice";
import ViewNotification from "./ViewNotification";

const { Text } = Typography;

const ICONS = {
  alert: <HiBellAlert className='text-xl' />,
  message: <BiSolidMessageRounded className='text-xl' />,
};

// Define background colors for different notification types
const BACKGROUNDS = {
  alert: "#FFEFD5", // light peach
  message: "#E6E6FA", // light lavender
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotiAsReadMutation();

  const viewHandler = (el) => {
    setSelected(el);
    readHandler("one", el._id);
    setOpen(true);
  };

  const readHandler = async (type, id) => {
    await markAsRead({ type, id }).unwrap();
    refetch();
  };

  const content = (
    <div style={{ maxWidth: 350, maxHeight: 400, overflowY: 'auto' }}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <Card
            onClick={() => viewHandler(item)}
            className="mb-2 cursor-pointer"
            style={{
              backgroundColor: BACKGROUNDS[item.notiType] || "#FFF", 
              borderRadius: 10,
              border: `1px solid ${item.notiType === 'alert' ? '#FF6347' : '#6A5ACD'}` 
            }}
          >
            <List.Item.Meta
              avatar={<div>{ICONS[item.notiType]}</div>}
              title={<Text strong style={{ color: item.notiType === 'alert' ? '#FF4500' : '#483D8B' }}>{item.notiType.charAt(0).toUpperCase() + item.notiType.slice(1)}</Text>}
              description={<Text style={{ color: '#555' }}>{item.text}</Text>}
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {moment(item.createdAt).fromNow()}
            </Text>
          </Card>
        )}
      />
      <div className="flex justify-between mt-2">
        <Button type="link" onClick={() => readHandler("all", "")}>
          Mark All Read
        </Button>
        <Button type="link" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Popover content={content} trigger="click" placement="bottomRight">
        <Badge count={data?.length} overflowCount={99} offset={[10, 0]}>
          <IoIosNotificationsOutline className='text-2xl text-gray-800 dark:text-white cursor-pointer' />
        </Badge>
      </Popover>
      {selected && <ViewNotification open={open} setOpen={setOpen} el={selected} />}
    </>
  );
}

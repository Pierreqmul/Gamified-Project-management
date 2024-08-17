import { Popover, List, Button, Badge } from "antd";
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

const ICONS = {
  alert: <HiBellAlert className='text-gray-600' />,
  message: <BiSolidMessageRounded className='text-gray-600' />,
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
    <div style={{ maxWidth: 300 }}>
      <List
        itemLayout="horizontal"
        dataSource={data?.slice(0, 5)}
        renderItem={(item) => (
          <List.Item onClick={() => viewHandler(item)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1c1c1c]">
            <List.Item.Meta
              avatar={<div>{ICONS[item.notiType]}</div>}
              title={<span className='text-gray-900 dark:text-gray-200 capitalize'>{item.notiType}</span>}
              description={<span className='text-gray-600 dark:text-gray-500'>{moment(item.createdAt).fromNow()}</span>}
            />
          </List.Item>
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

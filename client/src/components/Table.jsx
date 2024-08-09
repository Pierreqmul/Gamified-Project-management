import React, { useState } from "react";
import { Table as AntTable, Button, Avatar, Popconfirm, Tag, Space } from "antd";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { toast } from "sonner";
import { useTrashTaskMutation } from "../redux/slices/api/taskApiSlice.js";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils/index.js";
import { AddTask, TaskAssets, TaskColor } from "../components/tasks/index.js";
import { ConfirmatioDialog, UserInfo } from "./index.js";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [deleteTask] = useTrashTaskMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClickHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: selected,
        isTrashed: "trash",
      }).unwrap();

      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const columns = [
    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
      render: (text, task) => (
        <Space>
          <TaskColor className={TASK_TYPE[task.stage]} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag color={PRIOTITYSTYELS[priority]}>
          {ICONS[priority]} {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "date",
      key: "date",
      render: (date) => formatDate(new Date(date)),
    },
    {
      title: "Assets",
      key: "assets",
      render: (task) => (
        <TaskAssets
          activities={task?.activities?.length}
          subTasks={task?.subTasks?.length}
          assets={task?.assets?.length}
        />
      ),
    },
    {
      title: "Team",
      key: "team",
      render: (task) => (
        <Avatar.Group maxCount={3}>
          {task?.team?.map((m, index) => (
            <Avatar
              key={m._id}
              style={{
                backgroundColor: BGS[index % BGS?.length],
              }}
            >
              {m.name[0]}
            </Avatar>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (task) => (
        <Space>
          <Button type="link" onClick={() => editClickHandler(task)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => deleteClicks(task._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <AntTable columns={columns} dataSource={tasks} rowKey="_id" pagination={false} />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  );
};

export default Table;

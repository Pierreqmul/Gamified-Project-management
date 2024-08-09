import React, { useState } from "react";
import { Menu, Dropdown, Button, Modal } from "antd";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useChangeTaskStageMutation,
  useDuplicateTaskMutation,
  useTrashTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import ConfirmationDialog from "../ConfirmationDialog";
import AddSubTask from "./AddSubTask";
import AddTask from "./AddTask";
import TaskColor from "./TaskColor";
import { useSelector } from "react-redux";

const ChangeTaskActions = ({ _id, stage }) => {
  const { user } = useSelector((state) => state.auth);
  const [changeStage] = useChangeTaskStageMutation();

  const changeHandler = async (val) => {
    try {
      const data = {
        id: _id,
        stage: val,
        userId: user._id,
      };
      const res = await changeStage(data).unwrap();
      toast.success(res?.message);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const menuItems = [
    {
      label: "To-Do",
      stage: "todo",
      icon: <TaskColor className='bg-blue-600' />,
      onClick: () => changeHandler("todo"),
    },
    {
      label: "In Progress",
      stage: "in progress",
      icon: <TaskColor className='bg-yellow-600' />,
      onClick: () => changeHandler("in progress"),
    },
    {
      label: "Completed",
      stage: "completed",
      icon: <TaskColor className='bg-green-600' />,
      onClick: () => changeHandler("completed"),
    },
  ];

  const menu = (
    <Menu>
      {menuItems.map((item) => (
        <Menu.Item
          key={item.label}
          onClick={item.onClick}
          disabled={stage === item.stage}
        >
          {item.icon} {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button icon={<FaExchangeAlt />}>
        Change Task
      </Button>
    </Dropdown>
  );
};

export default function TaskDialog({ task }) {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [deleteTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({ id: task._id, isTrashed: "trash" }).unwrap();
      toast.success(res?.message);
      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();
      toast.success(res?.message);
      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="open" onClick={() => navigate(`/task/${task._id}`)}>
        <AiTwotoneFolderOpen /> Open Task
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => setOpenEdit(true)} disabled={!user.isAdmin}>
        <MdOutlineEdit /> Edit
      </Menu.Item>
      <Menu.Item key="addSubTask" onClick={() => setOpen(true)} disabled={!user.isAdmin}>
        <MdAdd /> Add Sub-Task
      </Menu.Item>
      <Menu.Item key="duplicate" onClick={duplicateHandler} disabled={!user.isAdmin}>
        <HiDuplicate /> Duplicate
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => setOpenDialog(true)} disabled={!user.isAdmin}>
        <RiDeleteBin6Line /> Delete
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="changeStage">
        <ChangeTaskActions _id={task._id} stage={task.stage} />
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button icon={<BsThreeDots />} />
      </Dropdown>
      
      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />
      <AddSubTask open={open} setOpen={setOpen} />
      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
}

import { useState } from "react";  
import { Dropdown, Menu, Button, Space, Typography, Divider, message } from "antd";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useChangeTaskStageMutation,
  useDuplicateTaskMutation,
  useTrashTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import AddTask from "./AddTask";
import ConfirmatioDialog from "../ConfirmationDialog";
import { useSelector } from "react-redux";

const { Text } = Typography;

const TaskDialog = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [deleteTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();
  const [changeStage] = useChangeTaskStageMutation();

  const handleMenuClick = async ({ key }) => {
    if (key === "delete") {
      setOpenDialog(true);
    } else if (key === "duplicate") {
      duplicateHandler();
    } else if (key === "edit") {
      setOpenEdit(true);
    } else if (key === "open") {
      navigate(`/task/${task._id}`);
    } else if (["todo", "in progress", "completed"].includes(key)) {
      changeHandler(key);
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({ id: task._id, isTrashed: "trash" }).unwrap();
      toast.success(res?.message);
      setOpenDialog(false);
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();
      toast.success(res?.message);
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const changeHandler = async (val) => {
    try {
      const res = await changeStage({ id: task._id, stage: val, userId: user._id }).unwrap();
      toast.success(res?.message);
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="open" icon={<AiTwotoneFolderOpen />}>
        Open Task
      </Menu.Item>
      <Menu.Item key="edit" icon={<MdOutlineEdit />}>
        Edit
      </Menu.Item>
      <Menu.Item key="duplicate" icon={<HiDuplicate />}>
        Duplicate
      </Menu.Item>
      <Divider />
      <Menu.ItemGroup title="Change Task Stage">
        <Menu.Item key="todo">To-Do</Menu.Item>
        <Menu.Item key="in progress">In Progress</Menu.Item>
        <Menu.Item key="completed" disabled={task.stage === "completed"}>
          Completed
        </Menu.Item>
      </Menu.ItemGroup>
      <Divider />
      <Menu.Item key="delete" danger icon={<RiDeleteBin6Line />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Space direction="vertical">
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Button icon={<BsThreeDots />} shape="circle" />
        </Dropdown>
      </Space>
      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />
      <ConfirmatioDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} />
    </>
  );
};

export default TaskDialog;

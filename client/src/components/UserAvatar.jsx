import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, Dropdown, Avatar, Button as AntButton } from "antd";
import { UserOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";
import AddUser from "./AddUser";
import ChangePassword from "./ChangePassword";

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/log-in");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => setOpen(true)} icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="changePassword" onClick={() => setOpenPassword(true)} icon={<LockOutlined />}>
        Change Password
      </Menu.Item>
      <Menu.Item key="logout" onClick={logoutHandler} danger icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
        <AntButton shape="circle" icon={<Avatar>{user?.name?.charAt(0)}</Avatar>} />
      </Dropdown>

      <AddUser open={open} setOpen={setOpen} userData={user} />
      <ChangePassword open={openPassword} setOpen={setOpenPassword} />
    </>
  );
};

export default UserAvatar;

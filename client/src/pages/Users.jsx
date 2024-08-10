import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import { Table, Button as AntButton, Avatar, Space, Tag, Typography } from "antd";
import { useSearchParams } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetTeamListsQuery,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import { AddUser, ConfirmatioDialog, Loading, UserAction } from "../components";
import { getInitials } from "../utils";

const { Title } = Typography;

const Users = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  const { data, isLoading, refetch } = useGetTeamListsQuery({
    search: searchTerm,
  });
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected).unwrap();
      refetch();
      toast.success(res?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  const userActionHandler = async () => {
    try {
      const res = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      }).unwrap();
      refetch();
      toast.success(res?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  useEffect(() => {
    refetch();
  }, [open]);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1890ff", borderRadius: "50px" }}>
            {getInitials(record.name)}
          </Avatar>
          {record.name}
        </Space>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Tag
          color={isActive ? "blue" : "yellow"}
          onClick={() => userStatusClick(record)}
          style={{ cursor: "pointer" }}
        >
          {isActive ? "Active" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <AntButton type="link" onClick={() => editClick(record)}>
            Edit
          </AntButton>
          <AntButton type="link" danger onClick={() => deleteClick(record._id)}>
            Delete
          </AntButton>
        </Space>
      ),
    },
  ];

  return isLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <>
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title level={3}>Team Members</Title>
          <AntButton
            type="primary"
            icon={<IoMdAdd />}
            onClick={() => setOpen(true)}
          >
            Add New User
          </AntButton>
        </div>
        <div className="bg-white dark:bg-[#1f1f1f] p-4 shadow-md rounded">
          <Table columns={columns} dataSource={data} rowKey="_id" />
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;

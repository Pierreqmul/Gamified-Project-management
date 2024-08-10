import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, DatePicker, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../utils/firebase";
import UserList from "./UsersSelect";
import dayjs from "dayjs";

const { Option } = Select;
const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];
const uploadedFileURLs = [];

const uploadFile = async (file) => {
  const storage = getStorage(app);
  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      () => {
        console.log("Uploading");
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            uploadedFileURLs.push(downloadURL);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

const AddTask = ({ open, setOpen, task }) => {
  const [form] = Form.useForm();
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [team, setTeam] = useState(task?.team || []);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const URLS = task?.assets ? [...task.assets] : [];

  const handleOnSubmit = async (values) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const newData = {
        ...values,
        assets: [...URLS, ...uploadedFileURLs],
        team,
        stage,
        priority,
        date: values.date.format('YYYY-MM-DD'),
      };

      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res.message);
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setAssets(fileList.map((file) => file.originFileObj));
  };

  return (
    <Modal
      title={task ? "Update Task" : "Add Task"}
      visible={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: task?.title || "",
          date: dayjs(task?.date || new Date(), "YYYY-MM-DD"),
          stage: stage,
          priority: priority,
          team: team,
        }}
        onFinish={handleOnSubmit}
      >
        <Form.Item
          label="Task Title"
          name="title"
          rules={[{ required: true, message: "Title is required!" }]}
        >
          <Input placeholder="Task title" />
        </Form.Item>

        <Form.Item label="Assign Task To">
          <UserList setTeam={setTeam} team={team} />
        </Form.Item>

        <Form.Item label="Task Stage" name="stage">
          <Select value={stage} onChange={setStage}>
            {LISTS.map((list) => (
              <Option key={list} value={list}>
                {list}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Priority Level" name="priority">
          <Select value={priority} onChange={setPriority}>
            {PRIORITY.map((level) => (
              <Option key={level} value={level}>
                {level}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Task Date"
          name="date"
          rules={[{ required: true, message: "Date is required!" }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Add Assets">
          <Upload
            fileList={assets.map((file) => ({
              uid: file.uid,
              name: file.name,
              status: "done",
              originFileObj: file,
            }))}
            onChange={handleFileChange}
            listType="picture"
            multiple
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading || isUpdating || uploading}>
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTask;

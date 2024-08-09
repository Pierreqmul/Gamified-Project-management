import React from "react";
import { useForm } from "react-hook-form";
import { Modal, Form, Input, Button, DatePicker } from "antd";
import { toast } from "sonner";
import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
import Loading from "../Loading";
import dayjs from 'dayjs';

const AddSubTask = ({ open, setOpen, id }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [addSbTask, { isLoading }] = useCreateSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      const res = await addSbTask({ data, id }).unwrap();
      toast.success(res.message);
      setTimeout(() => setOpen(false), 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Modal
      title="Add Sub-Task"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={handleSubmit(handleOnSubmit)}>
        <Form.Item
          label="Sub-Task Title"
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Input
            placeholder="Sub-Task title"
            {...register("title", { required: "Title is required!" })}
          />
        </Form.Item>

        <Form.Item
          label="Task Date"
          validateStatus={errors.date ? "error" : ""}
          help={errors.date?.message}
        >
          <DatePicker
            className="w-full"
            {...register("date", { required: "Date is required!" })}
            format="YYYY-MM-DD"
            placeholder="Select date"
          />
        </Form.Item>

        <Form.Item
          label="Tag"
          validateStatus={errors.tag ? "error" : ""}
          help={errors.tag?.message}
        >
          <Input
            placeholder="Tag"
            {...register("tag", { required: "Tag is required!" })}
          />
        </Form.Item>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Task
            </Button>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default AddSubTask;

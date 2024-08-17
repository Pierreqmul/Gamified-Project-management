import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Avatar,
  Card,
  Col,
  Row,
  Tabs,
  Tag,
  Typography,
  Button as AntButton,
  Divider,
  Tooltip,
  Checkbox,
  Input,
  List,
} from "antd";
import moment from "moment";
import { FaTasks } from "react-icons/fa";
import { RxActivityLog } from "react-icons/rx";
import {
  MdTaskAlt,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Loading } from "../components";
import { useGetSingleTaskQuery, usePostTaskActivityMutation } from "../redux/slices/api/taskApiSlice";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";

const { Text, Title } = Typography;

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Activities = ({ activity, id, refetch }) => {
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    try {
      const data = {
        type: selected?.toLowerCase(),
        activity: text,
      };
      const res = await postActivity({
        data,
        id,
      }).unwrap();
      setText("");
      toast.success(res?.message);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const ActivityCard = ({ item }) => (
    <List.Item>
      <List.Item.Meta
        avatar={ICONS[item?.type]}
        title={<Text strong>{item?.by?.name}</Text>}
        description={
          <>
            <Text type="secondary" style={{ marginRight: 8 }}>
              {item?.type.charAt(0).toUpperCase() + item?.type.slice(1)}
            </Text>
            <Text type="secondary">{moment(item?.date).fromNow()}</Text>
            <div>{item?.activity}</div>
          </>
        }
      />
    </List.Item>
  );

  return (
    <Row gutter={[16, 16]} className="min-h-screen">
      <Col xs={24} md={16}>
        <Title level={4}>Activities</Title>
        <List
          itemLayout="horizontal"
          dataSource={activity}
          renderItem={(item) => <ActivityCard item={item} />}
        />
      </Col>
      <Col xs={24} md={8}>
        <Title level={4}>Add Activity</Title>
        <Checkbox.Group
          value={[selected]}
          onChange={(values) => setSelected(values[0])}
        >
          <Checkbox value="Started">Started</Checkbox>
          <Checkbox value="Completed">Completed</Checkbox>
          <Checkbox value="In Progress">In Progress</Checkbox>
          <Checkbox value="Commented">Commented</Checkbox>
          <Checkbox value="Bug">Bug</Checkbox>
          <Checkbox value="Assigned">Assigned</Checkbox>
        </Checkbox.Group>
        <Input.TextArea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type ..."
          style={{ marginTop: 16 }}
        />
        <AntButton
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
        >
          Submit
        </AntButton>
      </Col>
    </Row>
  );
};

const TaskDetail = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);

  const [selected, setSelected] = useState(0);
  const task = data?.task;

  return isLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <Title level={2}>{task?.title}</Title>
      <Tabs defaultActiveKey="1" onChange={(key) => setSelected(parseInt(key) - 1)}>
        <Tabs.TabPane
          tab={
            <span>
              <FaTasks /> Task Detail
            </span>
          }
          key="1"
        >
          <Card className="bg-white shadow rounded-md px-8 py-8">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className="flex items-center gap-5">
                  <Tag
                    color={PRIOTITYSTYELS[task?.priority]}
                    style={{ backgroundColor: PRIOTITYSTYELS[task?.priority], color: "#fff" }}
                  >
                    {ICONS[task?.priority]} {task?.priority} Priority
                  </Tag>
                  <Tag color={TASK_TYPE[task?.stage]} style={{ color: "#000", backgroundColor: "#c9cfff" }}>
                    {task?.stage}
                  </Tag>
                </div>
                <Text type="secondary">
                  Created At: {new Date(task?.date).toDateString()}
                </Text>
                <Divider />
                <Row gutter={[16, 16]}>
                  <Col>
                    <Text strong>Assets :</Text> {task?.assets?.length}
                  </Col>
                  <Col>
                    <Text strong>Sub-Task :</Text> {task?.subTasks?.length}
                  </Col>
                </Row>
                <Divider />
                <Title level={5}>Task Team</Title>
                <Row gutter={[16, 16]}>
                  {task?.team?.map((m, index) => (
                    <Col key={index} xs={24} sm={12} lg={8}>
                      <Card bordered={false}>
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar style={{ backgroundColor: "#1890FF" }}>
                                {getInitials(m?.name)}
                              </Avatar>
                            }
                            title={m?.name}
                            description={m?.title}
                          />
                        </List.Item>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>

              <Col xs={24} md={12}>
                <Title level={5}>Sub-Tasks</Title>
                {task?.subTasks?.map((el, index) => (
                  <Card key={index} bordered={false} className="flex gap-3 mb-4">
                    <Avatar
                      style={{ backgroundColor: "#E6E6FA" }}
                      icon={<MdTaskAlt style={{ color: "#6A0DAD" }} />}
                    />
                    <div>
                      <Text type="secondary">{new Date(el?.date).toDateString()}</Text>
                      <Tag color="purple">{el?.tag}</Tag>
                      <p>{el?.title}</p>
                    </div>
                  </Card>
                ))}

                <Title level={5}>Attachments</Title>
                <div className="flex flex-wrap gap-2">
                  {task?.assets?.map((asset, index) => (
                    <a key={index} href={asset} target="_blank" rel="noopener noreferrer">
                      <img src={asset} alt={`Asset ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                    </a>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span>
              <RxActivityLog /> Activities/Timeline
            </span>
          }
          key="2"
        >
          <Activities activity={task?.activities} refetch={refetch} id={id} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TaskDetail;

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CodeFilled } from "@ant-design/icons";
import { Button, Modal, Form, Input, Select, message, Tabs } from "antd";
import axios from "axios";
import "antd/dist/reset.css";
import "./Navbar.css";

const { Option } = Select;
const { TabPane } = Tabs;

function NavBar() {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname === "/ranking" ? "ranking" : "home";

  const showModal = () => setModalVisible(true);
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        userData
      );
      if (response.status !== 200) {
        throw new Error("Registration failed");
      }

      const data = await response.data;
      if (data.success) {
        messageApi.open({
          type: "success",
          content: "등록이 완료되었습니다.",
        });
        form.resetFields();
        setModalVisible(false);
      } else {
        messageApi.open({
          type: "warning",
          content: data.message,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error,
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    if (key === "home") {
      navigate("/");
    } else if (key === "ranking") {
      navigate("/ranking");
    }
  };

  return (
    <>
      {contextHolder}
      <nav className="menu">
        <div className="menu__logo">
          <Link to="/">
            <CodeFilled style={{ fontSize: "24px", marginRight: "8px" }} />
            <span className="logo-text">Algorithm Survival</span>
          </Link>
        </div>
        <div className="menu__container">
          <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            className="menu_left"
          >
            <TabPane tab="Home" key="home" />
            <TabPane tab="Ranking" key="ranking" />
          </Tabs>
          <div className="menu_right">
            <Button type="primary" onClick={showModal}>
              Register
            </Button>
          </div>
        </div>
      </nav>

      <Modal
        title="Register"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ local: 1 }}
        >
          <Form.Item
            label="이름"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="이름을 입력해 주세요." />
          </Form.Item>

          <Form.Item
            label="백준 ID"
            name="handle"
            rules={[{ required: true, message: "Please input your handle!" }]}
          >
            <Input placeholder="백준 아이디를 입력해 주세요." />
          </Form.Item>

          <Form.Item
            label="지역"
            name="local"
            rules={[{ required: true, message: "지역을 등록해주세요." }]}
          >
            <Select placeholder="Select your local">
              <Option value={1}>서울</Option>
              <Option value={2}>대전</Option>
              <Option value={3}>구미</Option>
              <Option value={4}>광주</Option>
              <Option value={5}>부울경</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default NavBar;

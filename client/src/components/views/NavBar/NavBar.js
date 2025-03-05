import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import { CodeFilled } from '@ant-design/icons';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import 'antd/dist/reset.css';
import './Sections/Navbar.css';

const { Option } = Select;

function NavBar() {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => setModalVisible(true);
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/register', userData);
      if (response.status !== 200) {
        throw new Error('Registration failed');
      }

      

      const data = await response.data;
      if (data.success) {
        messageApi.open({
          type: 'success',
          content: '등록이 완료되었습니다.',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: '이미 등록된 정보입니다.',
        });
      }
      console.log('Server response:', data);
      form.resetFields();
      setModalVisible(false);
    } catch (error) {
      messageApi.open({
        type: 'warning',
        content: '아이디가 존재하지 않습니다.',
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <nav className="menu">
        <div className="menu__logo">
          <a href="/">
            <CodeFilled style={{ fontSize: '24px', marginRight: '8px' }} />
            Algorithm Survival
          </a>
        </div>
        <div className="menu__container">
          <div className="menu_left">
            <LeftMenu mode="horizontal" />
          </div>
          <Button type="primary" onClick={showModal} style={{ marginLeft: '10px' }}>
            Register
          </Button>
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
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Handle"
            name="handle"
            rules={[{ required: true, message: 'Please input your handle!' }]}
          >
            <Input placeholder="Enter your handle" />
          </Form.Item>

          <Form.Item
            label="Local"
            name="local"
            rules={[{ required: true, message: 'Please select your local!' }]}
          >
            <Select placeholder="Select your local">
              <Option value={1}>서울</Option>
              <Option value={2}>데전</Option>
              <Option value={3}>교미</Option>
              <Option value={4}>굉주</Option>
              <Option value={5}>부울겅</Option>
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
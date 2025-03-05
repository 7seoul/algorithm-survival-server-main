import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import { CodeFilled } from '@ant-design/icons';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import 'antd/dist/reset.css';
import './Sections/Navbar.css';

const { Option } = Select;

function NavBar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => setModalVisible(true);
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      message.success('Registration successful!');
      console.log('Server response:', data);
      form.resetFields();
      setModalVisible(false);
    } catch (error) {
      message.error(error.message || 'Something went wrong');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
import React, { useState } from 'react';
import { Form, Input, Select, Button, Card } from 'antd';
import { notificationController } from '@app/controllers/notificationController';
import axiosInstance from '@app/api/axiosInstance';

const groupChoices = ['CS-31', 'CS-32', 'CS-33', 'CS-34', 'CS-41', 'CS-42', 'CS-43', 'CS-44'];

const subgroupChoices = ['1', '2'];

const roleChoices = ['Headman', 'Deputy headman', 'Student'];

const locationChoices = ['In Ukraine', 'Lives aboard'];

export const StudentCreationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await axiosInstance.post('platform/students_table/', values);
      notificationController.success({
        message: 'Student created successfully!',
      });
      form.resetFields();
    } catch (error) {
      notificationController.error({
        message: 'Failed to create student! Please try again later!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create New Student" className="w-full max-w-md mx-auto">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: 'Please input first name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please input last name' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="surname" label="Surname">
          <Input />
        </Form.Item>

        <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Please select group' }]}>
          <Select>
            {groupChoices.map((group) => (
              <Select.Option key={group} value={group}>
                {group}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="subgroup" label="Subgroup" rules={[{ required: true, message: 'Please select subgroup' }]}>
          <Select>
            {subgroupChoices.map((subgroup) => (
              <Select.Option key={subgroup} value={subgroup}>
                {subgroup}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input email' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select role' }]}>
          <Select>
            {roleChoices.map((role) => (
              <Select.Option key={role} value={role}>
                {role}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please select location' }]}>
          <Select>
            {locationChoices.map((location) => (
              <Select.Option key={location} value={location}>
                {location}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Student
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StudentCreationForm;

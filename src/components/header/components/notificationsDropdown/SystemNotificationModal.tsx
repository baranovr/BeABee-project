import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Form, Select, Input, Button, message } from 'antd';
import axiosInstance from '@app/api/axiosInstance';
import { useAppSelector } from '@app/hooks/reduxHooks';

const { Option } = Select;

interface SystemNotificationModalProps {
  onNotificationCreated?: () => void;
}

export const SystemNotificationModal: React.FC<SystemNotificationModalProps> = ({ onNotificationCreated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      // Validate form fields
      await form.validateFields();

      // Get form values
      const values = form.getFieldsValue();

      // Start loading
      setIsLoading(true);

      // Send POST request to create notification
      const response = await axiosInstance.post('platform/system_notifications/', {
        type: values.type,
        description: values.description,
      });

      // Close modal
      handleCancel();

      // Trigger callback if provided
      onNotificationCreated?.();

      // Optional: show success message
      message.success('Notification created successfully!');
    } catch (error) {
      console.error('Create notification error:', error);
      // Optional: show error message
      message.error('Failed to create notification! Please try again later!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {user && user.statusInService === 'Creator' && (
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginLeft: 3 }}></Button>
      )}

      <Modal
        title="Create system notifications"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Select type of notification' }]}>
            <Select placeholder="Select type">
              <Option value="Success">Success</Option>
              <Option value="Warning">Warning</Option>
              <Option value="Error">Error</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Description' },
              { max: 150, message: 'No more than 150 chars' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Desription" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

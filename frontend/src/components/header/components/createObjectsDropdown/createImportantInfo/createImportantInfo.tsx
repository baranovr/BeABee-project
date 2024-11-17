import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/lib/upload';
import axiosInstance from "@app/api/axiosInstance";
import { useTranslation } from "react-i18next";

export const CreateImportantInfoForm: React.FC = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [image, setImage] = useState<RcFile | null>(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const validateAvatar = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    return true;
  };

  const handleOk = () => {
    if (!formData.title || !image) {
      message.error(t('common.creatingError'));
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    if (image) {
      formDataToSend.append('image', image);
    }

    const token = localStorage.getItem('access');

    axiosInstance.post('platform/importantinfo/', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(() => {
      setFormData({
        title: '',
        description: '',
      });
      setImage(null);
      setIsModalVisible(false);
      message.success(t('common.importantInfoCreated'));
    })
    .catch((error) => {
      console.error('Error creating info:', error);
      message.error(t('common.creatingError'));
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData({
      title: '',
      description: '',
    });
    setImage(null);
  };

  const handleImageChange = (image: RcFile) => {
    if (validateAvatar(image)) {
      setImage(image);
      return false; // Prevent automatic upload
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Im. Info
      </Button>
      <Modal
        title='Create Important Info'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t('common.submit')}
        cancelText={t('common.cancel')}
      >
        <Input
          placeholder={t('common.title') + ' (max 50 chars)'}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={{ marginBottom: '1rem' }}
          maxLength={30}
        />
        <Input.TextArea
          placeholder={t('common.description') + ' (max 3000 chars, optional)'}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          maxLength={3000}
          style={{ marginBottom: '1rem' }}
        />
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handleImageChange}
          onRemove={() => setImage(null)}
          accept=".jpg,.jpeg,.png,.webp"
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Info Image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Image</div>
            </div>
          )}
        </Upload>
        <div style={{ marginTop: '8px', color: '#666' }}>
          Supported formats: JPG, PNG, WEBP (max: 2MB)
        </div>
      </Modal>
    </>
  );
};

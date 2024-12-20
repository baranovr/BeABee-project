import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/lib/upload';
import axiosInstance from '@app/api/axiosInstance';
import { useTranslation } from 'react-i18next';

export const CreateNewsForm: React.FC = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [file, setFile] = useState<RcFile | null>(null);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const validateFile = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('File must be smaller than 2MB!');
      return false;
    }
    return true;
  };

  const handleOk = () => {
    if (!formData.title || !file) {
      message.error(t('common.creatingError'));
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    if (file) {
      formDataToSend.append('file', file);
    }

    const token = localStorage.getItem('access');

    axiosInstance
      .post('platform/news/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setFormData({
          title: '',
          description: '',
        });
        setFile(null);
        setIsModalVisible(false);
        message.success(t('common.newsCreated'));
      })
      .catch((error) => {
        console.error('Error creating news:', error);
        message.error(t('common.creatingError'));
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData({
      title: '',
      description: '',
    });
    setFile(null);
  };

  const handleFileChange = (file: RcFile) => {
    if (validateFile(file)) {
      setFile(file);
      return false; // Prevent automatic upload
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create News
      </Button>
      <Modal
        title={t('header.createNews')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t('common.submit')}
        cancelText={t('common.cancel')}
      >
        <Input
          placeholder={t('common.title') + ' (max 30 chars)'}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={{ marginBottom: '1rem' }}
          maxLength={30}
        />
        <Input.TextArea
          placeholder={t('common.description') + ' (max 1000 chars, optional)'}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          maxLength={1000}
          style={{ marginBottom: '1rem' }}
        />
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handleFileChange}
          onRemove={() => setFile(null)}
          accept=".jpg,.jpeg,.png,.webp,.gif"
        >
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="News File"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload File</div>
            </div>
          )}
        </Upload>
        <div style={{ marginTop: '8px', color: '#666' }}>Supported formats: JPG, PNG, WEBP, GIF (max: 2MB)</div>
      </Modal>
    </>
  );
};

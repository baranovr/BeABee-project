import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@app/api/axiosInstance';
import { RcFile } from 'antd/lib/upload';

export const CreatePostForm: React.FC = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<RcFile | null>(null); // Исправлено: RcFile | null

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
    if (!title || !description || !photo) {
      message.error(t('common.creatingError'));
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (photo) {
      formData.append('photo', photo);
    }

    const token = localStorage.getItem('access');

    axiosInstance
      .post('platform/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTitle('');
        setDescription('');
        setPhoto(null);
        setIsModalVisible(false);
        message.success(t('common.postCreated'));
      })
      .catch((error) => {
        console.error('Error creating post:', error);
        message.error(t('common.creatingError'));
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePhotoChange = (file: RcFile) => {
    if (validateAvatar(file)) {
      setPhoto(file);
      return false;
    }
    return false;
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {t('header.createPost')}
      </Button>
      <Modal
        title={t('header.createPost')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t('common.submit')}
        cancelText={t('common.cancel')}
      >
        <Input
          placeholder={t('common.title') + ' (max 50 chars)'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: '1rem' }}
          maxLength={50}
        />
        <Input.TextArea
          placeholder={t('common.description') + ' (max 1000 chars)'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ marginBottom: '1rem' }}
          maxLength={1000}
        />
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handlePhotoChange}
          onRemove={() => setPhoto(null)}
          accept=".jpg,.jpeg,.png,.webp"
        >
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt="Post Photo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Image</div>
            </div>
          )}
        </Upload>
        <div style={{ marginTop: '8px', color: '#666' }}>Supported formats: JPG, PNG, WEBP (max: 2MB)</div>
      </Modal>
    </>
  );
};

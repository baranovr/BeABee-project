import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
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

  const handleOk = () => {
    if (!title || !description || !photo) {
      message.error(t('common.fillAllFields'));
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (photo) {
      formData.append('photo', photo);
    }

    const token = localStorage.getItem('access');

    axios.post('http://localhost:8000/api/platform/posts/', formData, {
      headers: {
      'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
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
      message.error(t('common.postError'));
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePhotoChange = (file: RcFile) => {
    setPhoto(file);
    return false; // Останавливает автоматическую загрузку
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
          placeholder={t('common.title')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <Input.TextArea
          placeholder={t('common.description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ marginBottom: '1rem' }}
        />
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handlePhotoChange} // Используем новую функцию для обработки файла
          onRemove={() => setPhoto(null)}
        >
          {photo ? (
            <img src={URL.createObjectURL(photo)} alt="Post Photo" style={{ width: '100%' }} />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t('common.uploadPhoto')}</div>
            </div>
          )}
        </Upload>
      </Modal>
    </>
  );
};

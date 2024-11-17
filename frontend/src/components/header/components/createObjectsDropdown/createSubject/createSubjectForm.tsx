import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import axiosInstance from "@app/api/axiosInstance";
import {useTranslation} from "react-i18next";

export const CreateSubjectForm: React.FC = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');

  const typesSubjectsOptions = [
    { value: "Math/Physics", label: "Math/Physics" },
    { value: "Prog/Networks", label: "Prog/Networks" },
    { value: "Lang/Culture", label: "Lang/Culture" }
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (!name) {
      message.error('Please enter subject name');
      return;
    }

    const token = localStorage.getItem('access');

    axiosInstance.post('platform/subjects/', { name }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(() => {
      setName('');
      setIsModalVisible(false);
      message.success(t('common.subjectCreated'));
    })
    .catch((error) => {
      console.error('Error creating subject:', error);
      message.error(t('common.creatingError'));
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Subject
      </Button>
      <Modal
        title={t('header.createSubject')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t('common.submit')}
        cancelText={t('common.cancel')}
      >
        <Input
          placeholder={t('common.name') + ' (max 30 chars)'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '1rem' }}
          maxLength={30}
        />
      </Modal>
    </>
  );
};

import React, { useState } from 'react';
import { Modal, Input, Button, Select, message } from 'antd';
import axiosInstance from '@app/api/axiosInstance';
import { useTranslation } from 'react-i18next';

export const CreateSubjectForm: React.FC = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');

  const groupChoices = [
    { value: 'CS-31', label: 'CS-31' },
    { value: 'CS-32', label: 'CS-32' },
    { value: 'CS-33', label: 'CS-33' },
    { value: 'CS-34', label: 'CS-34' },
    { value: 'CS-41', label: 'CS-41' },
    { value: 'CS-42', label: 'CS-42' },
    { value: 'CS-43', label: 'CS-43' },
    { value: 'CS-44', label: 'CS-44' },
  ];

  const handleOk = () => {
    if (!name || !group) {
      message.error('Please enter subject name and select a group');
      return;
    }

    const token = localStorage.getItem('access');

    axiosInstance
      .post(
        'platform/subjects/',
        { name, group },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        setName('');
        setGroup('');
        setIsModalVisible(false);
        message.success(t('common.subjectCreated'));
      })
      .catch((error) => {
        console.error('Error creating subject:', error);
        message.error(t('common.creatingError'));
      });
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Create Subject
      </Button>
      <Modal
        title={t('header.createSubject')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
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
        <Select
          style={{ width: '100%' }}
          placeholder="Select Group"
          value={group}
          onChange={(value) => setGroup(value)}
        >
          {groupChoices.map((group) => (
            <Select.Option key={group.value} value={group.value}>
              {group.label}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

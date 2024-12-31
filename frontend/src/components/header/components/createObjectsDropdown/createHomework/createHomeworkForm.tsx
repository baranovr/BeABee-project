import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, DatePicker, message, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@app/api/axiosInstance';
import { Moment } from 'moment';
import moment from 'moment';

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  full_name_sur: string;
}
const { Option } = Select;

export const CreateHomeworkForm: React.FC = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: null as number | null,
    type: '',
    teacher: null as number | null,
    deadline: null as Date | null | undefined,
    for_group: '',
  });

  const homeworkTypeOptions = [
    { value: 'Math/Physics', label: 'Math/Physics' },
    { value: 'Prog/Networks', label: 'Prog/Networks' },
    { value: 'Lang/Culture', label: 'Lang/Culture' },
  ];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access');

        const [subjectsResponse, teachersResponse] = await Promise.all([
          axiosInstance.get('platform/subjects/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axiosInstance.get('platform/teachers/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setSubjects(subjectsResponse.data);
        setTeachers(teachersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load subjects and teachers!');
      }
    };

    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.subject ||
      !formData.type ||
      !formData.teacher ||
      !formData.for_group ||
      !formData.deadline
    ) {
      message.error(t('common.creatingError'));
      return;
    }

    const token = localStorage.getItem('access');

    axiosInstance
      .post('platform/homeworks/', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setFormData({
          title: '',
          description: '',
          subject: null,
          type: '',
          teacher: null,
          deadline: null,
          for_group: '',
        });
        setIsModalVisible(false);
        message.success(t('common.homeworkCreated'));
      })
      .catch((error) => {
        console.error('Error creating homework:', error);
        message.error(t('common.creatingError'));
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData({
      title: '',
      description: '',
      subject: null,
      type: '',
      teacher: null,
      deadline: null,
      for_group: '',
    });
  };

  const handleDeadlineChange = (date: Moment | null) => {
    setFormData({ ...formData, deadline: date ? date.toDate() : null });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Homework
      </Button>
      <Modal
        title="Create Homework"
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
          maxLength={50}
        />
        <Input.TextArea
          placeholder={t('common.description') + ' (max 2000 chars)'}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          maxLength={2000}
          style={{ marginBottom: '1rem' }}
        />
        <Select
          placeholder="Select subject"
          value={formData.subject}
          onChange={(value) => setFormData({ ...formData, subject: value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {subjects.map((subject) => (
            <Option key={subject.id} value={subject.id}>
              {subject.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select homework type"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {homeworkTypeOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select teacher"
          value={formData.teacher}
          onChange={(value) => setFormData({ ...formData, teacher: value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {teachers.map((teacher) => (
            <Option key={teacher.id} value={teacher.id}>
              {teacher.full_name_sur}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select group"
          value={formData.for_group}
          onChange={(value) => setFormData({ ...formData, for_group: value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {groupChoices.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <DatePicker
          showTime={{
            format: 'HH:mm',
            use12Hours: false,
          }}
          placeholder="Select deadline"
          value={formData.deadline ? moment(formData.deadline) : null}
          onChange={handleDeadlineChange}
          style={{ width: '100%' }}
        />
      </Modal>
    </>
  );
};

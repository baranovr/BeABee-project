import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Upload, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/lib/upload';
import axiosInstance from '@app/api/axiosInstance';
import { useTranslation } from 'react-i18next';

interface Subject {
  id: number;
  name: string;
}

export const CreateTeacherForm: React.FC = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    surname: '',
    subjects: [] as number[],
    degree: "Bachelor's Degree",
    email: '',
  });
  const [avatar, setAvatar] = useState<RcFile | null>(null);

  const degreeOptions = [
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: 'Candidate of Sciences', label: 'Candidate of Sciences' },
    { value: 'Doctor of Sciences', label: 'Doctor of Sciences' },
  ];

  useEffect(() => {
    // Fetch subjects when component mounts
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axiosInstance.get('platform/subjects/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        message.error('Failed to load subjects');
      }
    };

    fetchSubjects();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const validateAvatar = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('Image must be smaller than 1MB!');
      return false;
    }
    return true;
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleOk = () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.surname ||
      !formData.degree ||
      !formData.email ||
      !avatar ||
      formData.subjects.length === 0 ||
      formData.subjects.length > 5
    ) {
      message.error(t('common.creatingError'));
      return;
    }

    if (!validateEmail(formData.email)) {
      message.error('Please enter a valid email address!');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('surname', formData.surname);
    formData.subjects.forEach((subjectId) => {
      formDataToSend.append('subjects', subjectId.toString());
    });
    formDataToSend.append('degree', formData.degree);
    formDataToSend.append('email', formData.email);
    if (avatar) {
      formDataToSend.append('teacher_avatar', avatar);
    }

    const token = localStorage.getItem('access');

    axiosInstance
      .post('platform/teachers/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setFormData({
          first_name: '',
          last_name: '',
          surname: '',
          subjects: [],
          degree: '',
          email: '',
        });
        setAvatar(null);
        setIsModalVisible(false);
        message.success('Teacher created successfully');
      })
      .catch((error) => {
        console.error('Error creating teacher:', error);
        message.error('Error while creating teacher');
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData({
      first_name: '',
      last_name: '',
      surname: '',
      subjects: [],
      degree: '',
      email: '',
    });
    setAvatar(null);
  };

  const handleAvatarChange = (file: RcFile) => {
    if (validateAvatar(file)) {
      setAvatar(file);
      return false;
    }
    return false;
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Teacher
      </Button>
      <Modal
        title="Create Teacher"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
        width={600}
      >
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Input
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            maxLength={20}
          />
          <Input
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            maxLength={20}
          />
          <Input
            placeholder="Surname"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            maxLength={20}
          />
        </div>

        <Input
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ marginBottom: '1rem' }}
          type="email"
        />

        <Select
          mode="multiple"
          placeholder="Select subjects (max 5)"
          value={formData.subjects}
          onChange={(values) => setFormData({ ...formData, subjects: values })}
          style={{ width: '100%', marginBottom: '1rem' }}
          optionFilterProp="children"
          maxTagCount={5}
        >
          {subjects.map((subject) => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Select degree"
          value={formData.degree}
          onChange={(value) => setFormData({ ...formData, degree: value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {degreeOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>

        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handleAvatarChange}
          accept=".jpg,.jpeg,.png"
        >
          {avatar ? (
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Avatar</div>
            </div>
          )}
        </Upload>
        <div style={{ marginTop: '8px', color: '#666' }}>Supported formats: JPG, PNG, WEBP (max: 1MB)</div>
      </Modal>
    </>
  );
};

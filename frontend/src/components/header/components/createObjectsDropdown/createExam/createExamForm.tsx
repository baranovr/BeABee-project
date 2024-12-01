import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, DatePicker, message } from 'antd';
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

export const CreateExamForm: React.FC = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    teacher: null as number | null,
    subject: null as number | null,
    date_time: null as Date | null | undefined,
    details: '',
    group: '',
    type: ExamTypeChoices.SPECIFIC_TYPE,
  });

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

  const examTypeOptions = [
    { value: ExamTypeChoices.SPECIFIC_TYPE, label: ExamTypeChoices.SPECIFIC_TYPE },
    { value: ExamTypeChoices.ANNUAL_EXAM, label: ExamTypeChoices.ANNUAL_EXAM },
    { value: ExamTypeChoices.ANNUAL_EXAM_RET, label: ExamTypeChoices.ANNUAL_EXAM_RET },
    { value: ExamTypeChoices.YEAR_SESSION, label: ExamTypeChoices.YEAR_SESSION },
    { value: ExamTypeChoices.YEAR_SESSION_RET, label: ExamTypeChoices.YEAR_SESSION_RET },
    { value: ExamTypeChoices.SEM_SESSION, label: ExamTypeChoices.SEM_SESSION },
    { value: ExamTypeChoices.SEM_SESSION_RET, label: ExamTypeChoices.SEM_SESSION_RET },
    { value: ExamTypeChoices.MODULAR_CONTROL_WORK, label: ExamTypeChoices.MODULAR_CONTROL_WORK },
    { value: ExamTypeChoices.MODULAR_CONTROL_WORK_RET, label: ExamTypeChoices.MODULAR_CONTROL_WORK_RET },
    { value: ExamTypeChoices.CONTROL_WORK, label: ExamTypeChoices.CONTROL_WORK },
    { value: ExamTypeChoices.CONTROL_WORK_RET, label: ExamTypeChoices.CONTROL_WORK_RET },
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
    if (!formData.teacher || !formData.subject || !formData.date_time || !formData.group || !formData.type) {
      message.error(t('common.creatingError'));
      return;
    }

    const token = localStorage.getItem('access');

    axiosInstance
      .post('platform/exams/', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setFormData({
          teacher: null,
          subject: null,
          date_time: null,
          details: '',
          group: '',
          type: ExamTypeChoices.SPECIFIC_TYPE,
        });
        setIsModalVisible(false);
        message.success(t('common.examCreated'));
      })
      .catch((error) => {
        console.error('Error creating exam:', error);
        message.error(t('common.creatingError'));
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData({
      teacher: null,
      subject: null,
      date_time: null,
      details: '',
      group: '',
      type: ExamTypeChoices.SPECIFIC_TYPE,
    });
  };

  const handleDateTimeChange = (date: Moment | null) => {
    setFormData({ ...formData, date_time: date ? date.toDate() : null });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Exam
      </Button>
      <Modal
        title={t('header.createExam')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t('common.submit')}
        cancelText={t('common.cancel')}
      >
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
        <DatePicker
          showTime={{
            format: 'HH:mm',
            use12Hours: false,
          }}
          placeholder="Select date and time"
          value={formData.date_time ? moment(formData.date_time) : null}
          onChange={handleDateTimeChange}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <Input
          placeholder={t('common.details') + ' (max 50 chars)'}
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          style={{ marginBottom: '1rem' }}
          maxLength={50}
        />
        <Select
          placeholder="Select group"
          value={formData.group}
          onChange={(value) => setFormData({ ...formData, group: value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {groupChoices.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select exam type"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {examTypeOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

// Enum definitions from the original code
export class ExamTypeChoices {
  static ANNUAL_EXAM = 'Annual exam';
  static ANNUAL_EXAM_RET = 'Annual exam (retake)';

  static YEAR_SESSION = 'Year session';
  static YEAR_SESSION_RET = 'Year session (retake)';

  static SEM_SESSION = 'Semester session';
  static SEM_SESSION_RET = 'Semester session (retake)';

  static MODULAR_CONTROL_WORK = 'Modular control work';
  static MODULAR_CONTROL_WORK_RET = 'Modular control work (retake)';

  static CONTROL_WORK = 'Control work';
  static CONTROL_WORK_RET = 'Control work (retake)';

  static SPECIFIC_TYPE = 'Specific type';
}

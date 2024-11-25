// ExamTeacher.tsx

import React, { useState } from 'react';
import { Exam } from '@app/api/exams.api';
import * as S from './ExamTeacher.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Modal} from "antd";
import axiosInstance from "@app/api/axiosInstance";
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from "@app/hooks/reduxHooks";

interface ExamTeacherProps {
  exam: Exam;
  onDeleteSuccess?: () => void;
}

export const ExamTeacher: React.FC<ExamTeacherProps> = ({ exam, onDeleteSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector(state => state.user)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`platform/exams/${exam.id}/`);
      notificationController.success({
        message: 'Exam deleted successfully!',
      });
      setIsModalOpen(false);
      onDeleteSuccess?.();
    } catch (error) {
      notificationController.error({
        message: 'Failed to delete exam. Try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <S.TeacherCardWrapper>
        <S.TeacherCard>
          <S.TeacherCardBody>
            <BaseAvatar src={exam.teacher.teacher_avatar} size={128} alt="Teacher Avatar" />
            <S.TeacherName>
              {exam.teacher.full_name_sur}, {exam.subject}
            </S.TeacherName>
          </S.TeacherCardBody>

          <S.TeacherCardBody>
            <BaseRow gutter={[16, 16]}>
              <S.LabelCol span={12}>Date & time:</S.LabelCol>
              <S.ValueCol span={12}>{formatDate(exam.date_time)}</S.ValueCol>

              <S.LabelCol span={12}>Group:</S.LabelCol>
              <S.ValueCol span={12}>{exam.group}</S.ValueCol>

              <S.LabelCol span={12}>Type:</S.LabelCol>
              <S.ValueCol span={12}>{exam.type}</S.ValueCol>

              <S.LabelCol span={12}>Details:</S.LabelCol>
              <S.ValueCol span={12}>{exam.details}</S.ValueCol>
            </BaseRow>
          </S.TeacherCardBody>
        </S.TeacherCard>

        {user && (
            user.statusInService === "Creator" ||
            user.statusInService === "Admin"
        ) && (
        <S.DeleteButton onClick={handleDeleteClick}>
          <Trash2 size={20} />
        </S.DeleteButton>
        )}
      </S.TeacherCardWrapper>

      <Modal
        title={
          <S.ModalTitle>
            <AlertTriangle size={20} />
            <span>Delete Exam</span>
          </S.ModalTitle>
        }
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this exam?</p>
        <S.ModalWarning>
          <strong>{exam.subject}</strong> exam for group <strong>{exam.group}</strong>
          <br />
          Teacher: {exam.teacher.full_name_sur}
          <br />
          Date: {formatDate(exam.date_time)}
        </S.ModalWarning>
      </Modal>
    </>
  );
};

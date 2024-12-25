// TeacherCard.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as S from './TeacherCard.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseImage } from '@app/components/common/BaseImage/BaseImage';
import axiosInstance from '@app/api/axiosInstance';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface Subject {
  id: number;
  name: string;
}

interface TeacherCardProps {
  id: number;
  full_name_sur?: string;
  subjects?: Subject[];
  degree?: string;
  teacher_avatar?: string;
  email: string;
  onDeleteSuccess?: () => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  id,
  full_name_sur,
  subjects,
  degree,
  teacher_avatar,
  email,
  onDeleteSuccess,
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const subjectNames = subjects?.map((s) => s.name).join(', ');

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`platform/teachers/${id}/`);
      notificationController.success({
        message: 'Teacher deleted successfully!',
      });

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      setIsModalVisible(false);
    } catch (error) {
      notificationController.error({
        message: 'Failed to delete teacher. Try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.TeacherCard padding="16px">
      <BaseRow gutter={[{}, { xxl: 10 }]}>
        <BaseCol span={24}>
          <S.ImgWrapper>
            <BaseImage src={teacher_avatar} alt={full_name_sur} preview={false} />
            {user && (user.statusInService === 'Creator' || user.statusInService === 'Admin') && (
              <S.DeleteButton type="primary" danger icon={<DeleteOutlined />} onClick={() => setIsModalVisible(true)}>
                Delete
              </S.DeleteButton>
            )}
          </S.ImgWrapper>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow>
            <BaseCol span={24}>
              <S.Title>{t('common.teacher')}</S.Title>
            </BaseCol>

            <BaseCol span={24}>
              <S.Text>{full_name_sur}</S.Text>
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow>
            <BaseCol span={24}>
              <S.Title>{t('common.subject')}</S.Title>
            </BaseCol>

            <BaseCol span={24}>
              <S.Text>{subjectNames}</S.Text>
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow>
            <BaseCol span={24}>
              <S.Title>{t('common.degree')}</S.Title>
            </BaseCol>

            <BaseCol span={24}>
              <S.Text>{degree}</S.Text>
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow>
            <BaseCol span={24}>
              <S.Title>{t('Email')}</S.Title>
            </BaseCol>

            <BaseCol span={24}>
              <S.Text>{email}</S.Text>
            </BaseCol>
          </BaseRow>
        </BaseCol>
      </BaseRow>
      <Modal
        title={
          <S.ModalTitle>
            <ExclamationCircleOutlined />
            <span>Delete Teacher</span>
          </S.ModalTitle>
        }
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete teacher {full_name_sur}?</p>
        <h5>All related homeworks and exams with this teacher will be deleted!</h5>
      </Modal>
    </S.TeacherCard>
  );
};

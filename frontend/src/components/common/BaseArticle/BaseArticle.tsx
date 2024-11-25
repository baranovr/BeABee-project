// BaseArticle.tsx

import React, { useState } from 'react';
import { Dates } from '@app/constants/Dates';
import { BaseImage } from '../BaseImage/BaseImage';
import { BaseAvatar } from '../BaseAvatar/BaseAvatar';
import * as S from './BaseArticle.styles';
import * as A from '../../medical-dashboard/treatmentCard/ExamTeacher/ExamTeacher.styles';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import axiosInstance from '@app/api/axiosInstance';
import { notificationController } from '@app/controllers/notificationController';
import { Homework } from '@app/api/homeworks.api';
import { Modal } from 'antd';
import { Post } from '@app/api/posts.api';

interface BaseArticleProps {
  post: Post;
  onDeleteSuccess?: () => void;
  className?: string;
}

export const BaseArticle: React.FC<BaseArticleProps> = ({ post, onDeleteSuccess, className }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Управление модальным окном
  const [loading, setLoading] = useState(false); // Индикатор загрузки
  const { user } = useAppSelector((state) => state.user);

  // Функция удаления поста
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`platform/posts/${post.id}/`);
      notificationController.success({
        message: 'Post deleted successfully!',
      });

      if (onDeleteSuccess) {
        onDeleteSuccess(); // Обновление списка в родительском компоненте
      }

      setIsModalVisible(false); // Закрытие модального окна
    } catch (error) {
      notificationController.error({
        message: 'Failed to delete post. Try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Wrapper className={className}>
      <S.Header>
        {!!post.avatar && <BaseAvatar src={post.avatar} alt="author" size={43} />}
        <S.AuthorWrapper>
          {post.author && <S.Author>{post.author}</S.Author>}
          <S.DateTime>{Dates.format(post.created_at, 'L')}</S.DateTime>
        </S.AuthorWrapper>
      </S.Header>
      <BaseImage src={post.photo} alt="article" preview={false} />
      <S.InfoWrapper>
        <S.InfoHeader>
          <S.Title>{post.title}</S.Title>
        </S.InfoHeader>
        <S.Description>{post.description}</S.Description>
      </S.InfoWrapper>

      {user &&
        (post.author === user.nickName ||
          user.statusInService === 'Creator' ||
          (user.statusInService === 'Admin' && post.status_in_service === 'User')) && (
          <S.DeletePostButton onClick={() => setIsModalVisible(true)}>
            <Trash2 />
          </S.DeletePostButton>
        )}

      {/* Модальное окно подтверждения удаления */}
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete the post "{post.title}"?</p>
      </Modal>
    </S.Wrapper>
  );
};

interface HomeworkTeacherProps {
  homework: Homework;
}

export const HomeworkTeacher: React.FC<HomeworkTeacherProps> = ({ homework }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
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
      await axiosInstance.delete(`platform/homeworks/${homework.id}/`);
      notificationController.success({
        message: 'Homework deleted successfully!',
      });
      setIsModalOpen(false);
    } catch (error) {
      notificationController.error({
        message: 'Failed to delete homework. Try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <S.WrapperNoImg>
        <S.Header>
          <BaseAvatar src={homework.teacher_avatar} alt="teacher" size={43} />
          <S.AuthorWrapper>
            {homework.teacher && <S.Author>{homework.teacher}</S.Author>}
            <S.DateTime>
              {`Added by ${homework.added_by}`} at {formatDate(homework.created_at)}
            </S.DateTime>
          </S.AuthorWrapper>
        </S.Header>
        <S.InfoWrapper>
          <S.InfoHeader>
            <S.Title>{homework.title}</S.Title>
          </S.InfoHeader>
          {homework.type && <S.Detail>{`Subject: ${homework.subject}`}</S.Detail>}
          {homework.deadline && <S.Detail>{`Deadline: ${formatDate(homework.deadline)}`}</S.Detail>}
          {homework.for_group && <S.Detail>{`For group: ${homework.for_group}`}</S.Detail>}
          <S.TaskWrapper>
            <S.Description>{homework.description}</S.Description>
          </S.TaskWrapper>
        </S.InfoWrapper>

        {user && (user.statusInService === 'Creator' || user.statusInService === 'Admin') && (
          <S.DeleteButton onClick={handleDeleteClick}>
            <Trash2 size={20} />
          </S.DeleteButton>
        )}
      </S.WrapperNoImg>

      <Modal
        title={
          <A.ModalTitle>
            <AlertTriangle size={20} />
            <span>Delete Homework</span>
          </A.ModalTitle>
        }
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this homework?</p>
        <A.ModalWarning>
          <strong>{homework.title}</strong>
          <br />
          <br />
          Subject: {homework.subject}
          <br />
          Teacher: {homework.teacher}
          <br />
          For group: {homework.for_group}
          <br />
          Deadline: {formatDate(homework.deadline)}
        </A.ModalWarning>
      </Modal>
    </>
  );
};

import React, { useEffect, useState } from 'react';
import { useResponsive } from '@app/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@app/api/axiosInstance';
import * as S from './NftCard.styles';
import { message } from 'antd';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { getNewsList, News } from '@app/api/recentlynews.api';

interface NftCardProps {
  newsItem: News;
  onDelete?: (id: number) => void;
  onDeleteSuccess?: () => void;
}

const truncateText = (text: string, maxLength = 24) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const NftCard: React.FC<NftCardProps> = ({ newsItem, onDelete, onDeleteSuccess }) => {
  const { isTablet } = useResponsive();
  const { t } = useTranslation();
  const [news, setNews] = useState<News[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  const handleViewClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmVisible(false);
  };

  const refreshNews = () => {
    getNewsList()
      .then(setNews)
      .catch((error) => {
        console.error('Failed to load exams:', error);
      });
  };

  useEffect(() => {
    refreshNews();
  }, []);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`platform/news/${newsItem.id}/`);
      console.log(`News with ID ${newsItem.id} deleted successfully.`);
      message.success(t('nft.deletedSuccessfully'));
      setIsDeleteConfirmVisible(false);

      if (onDelete) {
        onDelete(newsItem.id);
      }

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error(`Failed to delete news with ID ${newsItem.id}:`, error);
      message.error(t('nft.accessDeniedDelete'));
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const tabletLayout = (
    <>
      <S.InfoHeader>
        <S.InfoText>by {newsItem.posted_by}</S.InfoText>
      </S.InfoHeader>

      <S.InfoFooter>
        <S.Description>{truncateText(newsItem.description)}</S.Description>
        <S.Date>{formatDate(newsItem.created_at)}</S.Date>
      </S.InfoFooter>
    </>
  );

  const mobileLayout = (
    <>
      <S.InfoRow>
        <S.InfoText>by {newsItem.posted_by}</S.InfoText>
        <S.Date>{formatDate(newsItem.created_at)}</S.Date>
      </S.InfoRow>

      <S.InfoRow>
        <S.Description>{newsItem.description}</S.Description>
      </S.InfoRow>
    </>
  );

  return (
    <>
      <S.Card padding={0} $img={newsItem.file}>
        <S.NftImage src={newsItem.file} alt="newsImage" />
        <S.ViewButton type="ghost" onClick={handleViewClick}>
          {t('nft.read_news')}
        </S.ViewButton>
        {user &&
          (newsItem.posted_by === user.nickName ||
            user.statusInService === 'Creator' ||
            (user.statusInService === 'Admin' && newsItem.status_in_service === 'User')) && (
            <S.DeleteNewsButton type="ghost" onClick={handleDeleteClick}>
              {'Delete'}
            </S.DeleteNewsButton>
          )}
        <S.NftInfo>
          <S.InfoRow>
            <S.Title>{newsItem.title}</S.Title>
          </S.InfoRow>
          {isTablet ? tabletLayout : mobileLayout}
        </S.NftInfo>

        <S.AuthorAvatar src={newsItem.avatar} alt={newsItem.posted_by} />

        <S.StyledModal
          title={newsItem.title}
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <S.Button key="close" type="primary" onClick={handleCloseModal}>
              {t('nft.close')}
            </S.Button>,
          ]}
        >
          <p>{newsItem.description}</p>
        </S.StyledModal>
      </S.Card>
      <S.StyledModalDelete
        title="Confirm delete"
        open={isDeleteConfirmVisible}
        onCancel={handleDeleteCancel}
        footer={[
          <S.Button key="cancel" onClick={handleDeleteCancel} disabled={isDeleting}>
            {t('common.cancel')}
          </S.Button>,
          <S.Button key="Login" type="primary" danger onClick={handleDeleteConfirm} loading={isDeleting}>
            {t('common.confirm')}
          </S.Button>,
        ]}
      >
        <p className="confirm_message">Are you sure you want to delete "{newsItem.title}" news?</p>
      </S.StyledModalDelete>
    </>
  );
};

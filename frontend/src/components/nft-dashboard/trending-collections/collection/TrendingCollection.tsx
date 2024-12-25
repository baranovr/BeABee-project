import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImportantInfo } from '@app/api/activity.api';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { Button, message } from 'antd';
import axiosInstance from '@app/api/axiosInstance';
import * as S from './TrendingCollection.styles';
import { StyledModalDelete } from '@app/components/nft-dashboard/recently-added/news-card/NftCard.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface ImportantInfoProps extends ImportantInfo {
  onDelete?: (id: number) => void; // Функция обратного вызова для удаления элемента
  onDeleteSuccess?: () => void;
}

export const TrendingCollection: React.FC<ImportantInfoProps> = ({
  id,
  title,
  owner,
  status_in_service,
  created_at,
  image,
  avatar,
  description,
  onDelete,
  onDeleteSuccess,
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const handleBidClick = () => {
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

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`platform/importantinfo/${id}/`);
      message.success(t('nft.deletedSuccessfully'));
      setIsDeleteConfirmVisible(false);
      if (onDelete) {
        onDelete(id);
      }
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error(`Failed to delete important info with ID ${id}:`, error);
      message.error(t('nft.accessDeniedDelete'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <S.Card padding={0} $img={image}>
        <S.CollectionImage src={image} alt="nft" />
        <S.BidButton type="ghost" onClick={handleBidClick}>
          {t('nft.bid')}
        </S.BidButton>
        {user &&
          (owner === user.nickName ||
            user.statusInService === 'Creator' ||
            (user.statusInService === 'Admin' && status_in_service === 'User')) && (
            <S.BidButtonDelete type="ghost" onClick={handleDeleteClick}>
              {'Delete'}
            </S.BidButtonDelete>
          )}
        <S.NftCollectionInfo>
          <S.AuthorAvatarWrapper>
            <BaseAvatar shape="circle" size={64} src={avatar} alt={owner} />
          </S.AuthorAvatarWrapper>
          <S.InfoRow>
            <S.Title level={5}>{title}</S.Title>
          </S.InfoRow>
          <S.InfoRow>
            <S.OwnerText>
              {t('nft.by')} {owner}
            </S.OwnerText>
            <S.USDText>
              {new Date(created_at).toLocaleString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </S.USDText>
          </S.InfoRow>
        </S.NftCollectionInfo>

        <S.StyledModal
          title={title}
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" type="primary" onClick={handleCloseModal}>
              {t('nft.close')}
            </Button>,
          ]}
        >
          <p>{description}</p>
        </S.StyledModal>
      </S.Card>
      <StyledModalDelete
        title="Confirm delete"
        visible={isDeleteConfirmVisible}
        onCancel={handleDeleteCancel}
        footer={[
          <Button key="cancel" onClick={handleDeleteCancel} disabled={isDeleting}>
            {t('common.cancel')}
          </Button>,
          <Button key="Login" type="primary" danger onClick={handleDeleteConfirm} loading={isDeleting}>
            {t('common.confirm')}
          </Button>,
        ]}
      >
        <p className="confirm_message">Are you sure you want to delete "{title}" im. info?</p>
      </StyledModalDelete>
    </>
  );
};

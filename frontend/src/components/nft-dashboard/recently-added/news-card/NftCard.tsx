import React, { useState } from 'react';
import { useResponsive } from '@app/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { News } from '@app/api/mainpageDashboard.api';
import * as S from './NftCard.styles';

interface NftCardProps {
  newsItem: News;
}

const truncateText = (text: string, maxLength = 40) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const NftCard: React.FC<NftCardProps> = ({ newsItem }) => {
  const { isTablet } = useResponsive();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleViewClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
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
    <S.Card padding={0} $img={newsItem.file}>
      <S.NftImage src={newsItem.file} alt="newsImage" />
      <S.ViewButton type="ghost" onClick={handleViewClick}>
        {t('nft.read_news')}
      </S.ViewButton>
      <S.NftInfo>
        <S.InfoRow>
          <S.Title>{newsItem.title}</S.Title>
        </S.InfoRow>
        {isTablet ? tabletLayout : mobileLayout}
      </S.NftInfo>

      <S.AuthorAvatar src={newsItem.avatar} alt={newsItem.posted_by} />

      <S.StyledModal
        title={newsItem.title}
        visible={isModalVisible}
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
  );
};

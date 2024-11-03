// TrendingCollection.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImportantInfo } from '@app/api/activity.api';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { Button } from 'antd';
import * as S from './TrendingCollection.styles';

export const TrendingCollection: React.FC<ImportantInfo> = ({
  title,
  owner,
  created_at,
  image,
  avatar,
  description,
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleBidClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <S.Card padding={0} $img={image}>
      <S.CollectionImage src={image} alt="nft" />
      <S.BidButton type="ghost" onClick={handleBidClick}>
        {t('nft.bid')}
      </S.BidButton>
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
  );
};

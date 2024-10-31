import React from 'react';
import { useResponsive } from '@app/hooks/useResponsive';
import { NewsItem } from '@app/api/mainpageDashboard.api';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import * as S from './NftCard.styles';

interface NftCardProps {
  newsItem: NewsItem;
}

export const NftCard: React.FC<NftCardProps> = ({ newsItem }) => {
  const { isTablet } = useResponsive();

  const tabletLayout = (
    <>
      <S.InfoHeader>
        <S.InfoText>@{newsItem.author}</S.InfoText>
      </S.InfoHeader>

      <S.InfoFooter>
        <S.CurrentBidWrapper>
          <S.CurrentBid>Current Bid</S.CurrentBid>
          <S.BidCrypto>
            {getCurrencyPrice(formatNumberWithCommas(newsItem.currentBidCrypto), CurrencyTypeEnum.ETH, false)}
          </S.BidCrypto>
        </S.CurrentBidWrapper>

        <S.CurrentBidWrapper>
          <S.Bid>{getCurrencyPrice(formatNumberWithCommas(newsItem.currentBid), CurrencyTypeEnum.USD)}</S.Bid>
        </S.CurrentBidWrapper>
      </S.InfoFooter>
    </>
  );

  const mobileLayout = (
    <>
      <S.InfoRow>
        <S.InfoText>@{newsItem.author}</S.InfoText>
        <S.BidCrypto>
          {getCurrencyPrice(formatNumberWithCommas(newsItem.currentBidCrypto), CurrencyTypeEnum.ETH, false)}
        </S.BidCrypto>
      </S.InfoRow>

      <S.InfoRow>
        <S.CurrentBid>Current Bid</S.CurrentBid>
        <S.Bid>{getCurrencyPrice(formatNumberWithCommas(newsItem.currentBid), CurrencyTypeEnum.USD)}</S.Bid>
      </S.InfoRow>
    </>
  );

  return (
    <S.Card padding={0} $img={newsItem.image}>
      <S.NftImage src={newsItem.image} alt="nftImage" />
      <S.NftInfo>
        <S.InfoRow>
          <S.Title>{newsItem.title}</S.Title>
        </S.InfoRow>
        {isTablet ? tabletLayout : mobileLayout}
      </S.NftInfo>
    </S.Card>
  );
};

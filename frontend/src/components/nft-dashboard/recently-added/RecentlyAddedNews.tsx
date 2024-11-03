// RecentlyAddedNews.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { BaseCarousel } from '@app/components/common/BaseCarousel/Carousel';
import { NFTCardHeader } from '@app/components/nft-dashboard/common/NFTCardHeader/NFTCardHeader';
import { ViewAll } from '@app/components/nft-dashboard/common/ViewAll/ViewAll';
import { NftCard } from '@app/components/nft-dashboard/recently-added/news-card/NftCard';
import { News, getRecentlyAddedNews } from '@app/api/mainpageDashboard.api';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './RecentlyAddedNews.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const RecentlyAddedNews: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [showAll, setShowAll] = useState(false);

  const { t } = useTranslation();
  const { mobileOnly, isTablet } = useResponsive();

  useEffect(() => {
    getRecentlyAddedNews().then((result) => {
      setNews(result);
    });
  }, []);

  const cards = useMemo(() => {
    return {
      mobile: news.slice(0, 3).map((item) => <NftCard key={item.title} newsItem={item} />),
      tablet: news.map((item) => (
        <div key={item.title}>
          <S.CardWrapper>
            <NftCard newsItem={item} />
          </S.CardWrapper>
        </div>
      )),
      grid: news.map((item) => (
        <BaseCol key={item.title} xs={24} sm={12} md={8}>
          <S.CardWrapper>
            <NftCard newsItem={item} />
          </S.CardWrapper>
        </BaseCol>
      )),
    };
  }, [news]);

  const sliderRef = useRef<any>();

  const handleViewAllClick = () => {
    setShowAll(true);
  };

  const handleBackToSlider = () => {
    setShowAll(false);
  };

  return (
    <>
      <NFTCardHeader title={t('nft.recentlyAddedNews')}>
        {isTablet && !showAll && (
          <BaseRow align="middle">
            <BaseCol>
              <ViewAll bordered={false} onClick={handleViewAllClick} />
            </BaseCol>

            <BaseCol>
              <S.ArrowBtn type="text" size="small" onClick={() => sliderRef.current && sliderRef.current.slickPrev()}>
                <LeftOutlined />
              </S.ArrowBtn>
            </BaseCol>

            <BaseCol>
              <S.ArrowBtn type="text" size="small" onClick={() => sliderRef.current && sliderRef.current.slickNext()}>
                <RightOutlined />
              </S.ArrowBtn>
            </BaseCol>
          </BaseRow>
        )}
        {isTablet && showAll && (
          <BaseRow align="middle">
            <BaseCol>
              <S.BackButton type="text" size="small" onClick={handleBackToSlider}>
                {t('common.back')}
              </S.BackButton>
            </BaseCol>
          </BaseRow>
        )}
      </NFTCardHeader>

      <S.SectionWrapper>
        {mobileOnly && !showAll && cards.mobile}
        {mobileOnly && showAll && <BaseRow gutter={[20, 20]}>{cards.grid}</BaseRow>}

        {isTablet && !showAll && news.length > 0 && (
          <BaseCarousel
            ref={sliderRef}
            slidesToShow={3}
            responsive={[
              {
                breakpoint: 1900,
                settings: {
                  slidesToShow: 2,
                },
              },
            ]}
          >
            {cards.tablet}
          </BaseCarousel>
        )}

        {isTablet && showAll && <BaseRow gutter={[20, 20]}>{cards.grid}</BaseRow>}
      </S.SectionWrapper>

      {mobileOnly && !showAll && (
        <S.ViewAllWrapper>
          <ViewAll onClick={handleViewAllClick} />
        </S.ViewAllWrapper>
      )}
    </>
  );
};

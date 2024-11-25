// TrendingCollections.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { BaseCarousel } from '@app/components/common/BaseCarousel/Carousel';
import { ViewAll } from '@app/components/nft-dashboard/common/ViewAll/ViewAll';
import { NFTCardHeader } from '@app/components/nft-dashboard/common/NFTCardHeader/NFTCardHeader';
import { TrendingCollection } from '@app/components/nft-dashboard/trending-collections/collection/TrendingCollection';
import { useResponsive } from '@app/hooks/useResponsive';
import { getTrendingActivities, ImportantInfo } from '@app/api/activity.api';
import * as S from './TrendingCollections.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import {getImportantInfoList} from "@app/api/importantinfo.api";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export const TrendingCollections: React.FC = () => {
  const [trending, setTrending] = useState<ImportantInfo[]>([]);
  const [showAll, setShowAll] = useState(false);

  const { mobileOnly, isTablet: isTabletOrHigher } = useResponsive();

  useEffect(() => {
    getTrendingActivities().then((res) => setTrending(res));
  }, []);

  const refreshInfo = () => {
      getImportantInfoList()
          .then(setTrending)
          .catch((error) => {
              console.error('Failed to load important info:', error);
          });
  };

    useEffect(() => {
        refreshInfo()
    }, []);

  const { t } = useTranslation();

  const trendingList = useMemo(() => {
    return {
      mobile: trending.map((item, index) => <TrendingCollection key={index} {...item} />).slice(0, 3),
      tablet: trending.map((item, index) => (
        <div key={index}>
          <S.CardWrapper>
            <TrendingCollection {...item} onDeleteSuccess={refreshInfo}/>
          </S.CardWrapper>
        </div>
      )),
      grid: trending.map((item, index) => (
        <BaseCol key={index} xs={24} sm={12} md={8}>
          <S.CardWrapper>
            <TrendingCollection {...item} onDeleteSuccess={refreshInfo}/>
          </S.CardWrapper>
        </BaseCol>
      )),
    };
  }, [trending]);

  const sliderRef = useRef<Slider>(null);

  const handleViewAllClick = () => {
    setShowAll(true);
  };

  const handleBackToSlider = () => {
    setShowAll(false);
  };

  return (
    <>
      <NFTCardHeader title={t('nft.trendingCollections')}>
        {isTabletOrHigher && !showAll && (
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
        {isTabletOrHigher && showAll && (
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
        {mobileOnly && !showAll && trendingList.mobile}
        {mobileOnly && showAll && <BaseRow gutter={[20, 20]}>{trendingList.grid}</BaseRow>}

        {isTabletOrHigher && !showAll && trending.length > 0 && (
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
            {trendingList.tablet}
          </BaseCarousel>
        )}

        {isTabletOrHigher && showAll && <BaseRow gutter={[20, 20]}>{trendingList.grid}</BaseRow>}
      </S.SectionWrapper>

      {mobileOnly && !showAll && (
        <S.ViewAllWrapper>
          <ViewAll onClick={handleViewAllClick} />
        </S.ViewAllWrapper>
      )}
    </>
  );
};

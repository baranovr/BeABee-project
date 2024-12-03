import React, { useState } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { MapCard } from '@app/components/medical-dashboard/mapCard/MapCard';
import { References } from '@app/components/common/References/References';
import { useResponsive } from '@app/hooks/useResponsive';
import { RecentlyAddedNews } from '@app/components/nft-dashboard/recently-added/RecentlyAddedNews';
import { TrendingCollections } from '@app/components/nft-dashboard/trending-collections/TrendingCollections';
import { ActivityStory } from '@app/components/nft-dashboard/activityStory/ActivityStory';
import { RecentActivity } from '@app/components/nft-dashboard/recentActivity/RecentActivity';
import * as S from './DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

const MedicalDashboardPage: React.FC = () => {
  const { isDesktop } = useResponsive();
  const [refreshNews, setRefreshNews] = useState(0);

  const handleNewsUpdate = () => {
    setRefreshNews((prev) => prev + 1);
  };

  const desktopLayout = (
    <BaseRow>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
        <BaseRow>
          <BaseCol span={24}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Welcome to BeABee service 🐝</h1>
            <p style={{ textAlign: 'center' }}>
              This service is made for FIT students of Taras Shevchenko National University of Kyiv.
            </p>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              With its help you can easily view information about students, teachers and works. You will no longer ask
              questions like "Sho po domashke?"
            </p>
          </BaseCol>
        </BaseRow>

        <BaseRow gutter={[60, 60]}>
          <BaseCol span={24}>
            <RecentlyAddedNews />
          </BaseCol>

          <BaseCol span={24}>
            <TrendingCollections />
          </BaseCol>

          <BaseCol id="map" span={24}>
            <MapCard />
          </BaseCol>

          <BaseCol span={24}>
            <RecentActivity />
          </BaseCol>
        </BaseRow>
        <References />
      </S.LeftSideCol>

      <S.RightSideCol xl={8} xxl={7}>
        <S.ScrollWrapper id="activity-story">
          <ActivityStory />
        </S.ScrollWrapper>
      </S.RightSideCol>
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow gutter={[20, 24]}>
      <BaseCol span={24}>
        <RecentlyAddedNews />
      </BaseCol>

      <BaseCol span={24}>
        <TrendingCollections />
      </BaseCol>

      <BaseCol id="map" md={24} order={4}>
        <MapCard />
      </BaseCol>

      <BaseCol span={24}>
        <RecentActivity />
      </BaseCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>Main Page</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default MedicalDashboardPage;

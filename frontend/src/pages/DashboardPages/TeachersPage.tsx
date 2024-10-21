import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ScreeningsCard } from '@app/components/medical-dashboard/screeningsCard/ScreeningsCard/ScreeningsCard';
import { ExamCard } from '@app/components/medical-dashboard/treatmentCard/ExamCard';
import { FavoritesTeachersCard } from '@app/components/medical-dashboard/favoriteDoctors/FavoriteTeachersCard/FavoritesTeachersCard';
import { PatientResultsCard } from '@app/components/medical-dashboard/PatientResultsCard/PatientResultsCard';
import { StatisticsCards } from '@app/components/medical-dashboard/statisticsCards/StatisticsCards';
import { NewsCard } from '@app/components/medical-dashboard/TeacherCard/NewsCard';
import { References } from '@app/components/common/References/References';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

const TeachersPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();

  const { t } = useTranslation();

  const desktopLayout = (
    <BaseRow>
      <S.LeftSideCol xl={16} xxl={17}>
        <BaseRow gutter={[30, 30]}>
          <BaseCol span={24}>
            <BaseRow gutter={[30, 30]}>
              <StatisticsCards />
            </BaseRow>
          </BaseCol>

          <BaseCol id="homework-types-popularity" span={24}>
            <ScreeningsCard />
          </BaseCol>

          <BaseCol id="exam-plan" xl={24}>
            <ExamCard />
          </BaseCol>

          <BaseCol id="favorite-Teachers" xl={24}>
            <FavoritesTeachersCard />
          </BaseCol>

          <BaseCol id="news" span={24}>
            <NewsCard />
          </BaseCol>
        </BaseRow>
        <References />
      </S.LeftSideCol>

      <S.RightSideCol xl={8} xxl={7}>
        <S.Space />
        <S.ScrollWrapper id="patient-timeline">
          <PatientResultsCard />
        </S.ScrollWrapper>
      </S.RightSideCol>
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow gutter={[20, 20]}>
      <StatisticsCards />

      <BaseCol id="homework-types-popularity" xs={24} md={12} order={(isTablet && 5) || 0}>
        <ScreeningsCard />
      </BaseCol>

      <BaseCol id="exam-plan" xs={24} md={24} order={(isTablet && 10) || 0}>
        <ExamCard />
      </BaseCol>

      <BaseCol id="patient-timeline" xs={24} md={12} order={(isTablet && 11) || 0}>
        <PatientResultsCard />
      </BaseCol>

      <BaseCol id="favorite-Teachers" xs={24} md={24} order={(isTablet && 13) || 0}>
        <FavoritesTeachersCard />
      </BaseCol>

      <BaseCol id="news" xs={24} md={24} order={(isTablet && 14) || 0}>
        <NewsCard />
      </BaseCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{t('common.medical-dashboard')}</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default TeachersPage;

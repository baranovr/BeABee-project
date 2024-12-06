import React from 'react';
import { useTranslation } from 'react-i18next';
import { CurrentStatisticsState } from '../ScreeningsCard/ScreeningsCard';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

interface ScreeningsHeaderProps {
  currentStatistics: CurrentStatisticsState;
  setCurrentStatistics: (func: (state: CurrentStatisticsState) => CurrentStatisticsState) => void;
}

export const ScreeningsHeader: React.FC<ScreeningsHeaderProps> = () => {
  const { t } = useTranslation();

  return (
    <BaseRow gutter={[0, { xs: 15, sm: 15, md: 20 }]} align="middle">
      <BaseCol xs={24} xl={12}>
        {'Popularity of Homework Types'}
      </BaseCol>
    </BaseRow>
  );
};

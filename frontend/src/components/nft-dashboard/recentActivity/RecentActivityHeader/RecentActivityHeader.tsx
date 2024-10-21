import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FilterIcon } from '@app/components/common/icons/FilterIcon';
import { NFTCardHeader } from '@app/components/nft-dashboard/common/NFTCardHeader/NFTCardHeader';
import { RecentActivityFilterState } from '@app/components/nft-dashboard/recentActivity/RecentActivity';
import { useResponsive } from '@app/hooks/useResponsive';

interface RecentActivityHeaderProps {
  filters: RecentActivityFilterState;
  setFilters: (func: (state: RecentActivityFilterState) => RecentActivityFilterState) => void;
}

export const RecentActivityHeader: React.FC<RecentActivityHeaderProps> = ({}) => {
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  return (
    <>
      <NFTCardHeader title={t('nft.recentActivity')}>
        {!isDesktop && <BaseButton size="large" noStyle type="text" icon={<FilterIcon />} />}
      </NFTCardHeader>
    </>
  );
};

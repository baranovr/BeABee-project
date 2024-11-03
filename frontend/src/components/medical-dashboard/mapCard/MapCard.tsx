// MapCard.tsx

import React, { useMemo } from 'react';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import { TeachersMap } from '@app/components/medical-dashboard/mapCard/TeachersMap/TeachersMap';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const MapCard: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const currentUser = useAppSelector((state) => state.user.user);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const key = useMemo(() => Math.random(), [theme]); // create new key on every change of theme and remount map component

  if (!currentUser) {
    return null; // или можно показать заглушку/спиннер
  }

  return (
    <DashboardCard padding={0}>
      <TeachersMap key={key} currentUserId={currentUser.id} />
    </DashboardCard>
  );
};

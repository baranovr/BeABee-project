import React, { useEffect, useMemo, useState } from 'react';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import { TeachersMap } from '@app/components/medical-dashboard/mapCard/TeachersMap/TeachersMap';
import { Teacher, getTeachersData } from '@app/api/doctors.api';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const MapCard: React.FC = () => {
  const [teacher, setTeacher] = useState<Teacher[]>([]);

  useEffect(() => {
    getTeachersData().then((res) => setTeacher(res));
  }, []);

  const theme = useAppSelector((state) => state.theme.theme);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const key = useMemo(() => Math.random(), [theme]); // create new key on every change of theme and remount map component

  return (
    <DashboardCard padding={0}>
      <TeachersMap key={key} teachers={teacher} />
    </DashboardCard>
  );
};

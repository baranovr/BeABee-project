import React, { useEffect, useMemo, useState } from 'react';
import { getGendersList, UserGender } from '@app/api/covid.api';
import { useTranslation } from 'react-i18next';
import { DashboardCard } from '../../medical-dashboard/DashboardCard/DashboardCard';
import { CovidChart } from './CovidChart';
import { NotFound } from '@app/components/common/NotFound/NotFound';
import { notificationController } from '@app/controllers/notificationController';

export const UserGenderCard: React.FC = () => {
  const [userData, setUserData] = useState<UserGender[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    getGendersList()
      .then(setUserData)
      .catch((e) => notificationController.error({ message: e.message }));
  }, []);

  // Группируем данные по дате и полу
  const { maleArr, femaleArr, dateArr } = useMemo(() => {
    const groupedData: Record<string, { male: number; female: number }> = {};

    userData.forEach(({ sex, date_joined }) => {
      const date = new Date(date_joined).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = { male: 0, female: 0 };
      }
      if (sex.toLowerCase() === 'male') {
        groupedData[date].male++;
      } else if (sex.toLowerCase() === 'female') {
        groupedData[date].female++;
      }
    });

    const dateArr = Object.keys(groupedData);
    const maleArr = dateArr.map((date) => groupedData[date].male);
    const femaleArr = dateArr.map((date) => groupedData[date].female);

    return { maleArr, femaleArr, dateArr };
  }, [userData]);

  const chartData = useMemo(
    () => ({
      male: { title: 'Male', data: maleArr },
      female: { title: 'Female', data: femaleArr },
    }),
    [maleArr, femaleArr, t],
  );

  return (
    <DashboardCard id="user-stats" title={'How many of us?'} padding={0}>
      {userData.length > 0 ? (
        <CovidChart confirmed={chartData.male} deaths={chartData.female} dateArr={dateArr} />
      ) : (
        <NotFound />
      )}
    </DashboardCard>
  );
};

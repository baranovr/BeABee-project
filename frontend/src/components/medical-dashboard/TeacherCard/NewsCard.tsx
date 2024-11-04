import React, { useEffect, useState } from 'react';
import { getHomeworksList, Homework } from '@app/constants/dashboardHomeworks';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import * as S from './NewsCard.styles';
import { useTranslation } from 'react-i18next';
import { BaseArticle } from '@app/components/common/BaseArticle/BaseArticle';

export const NewsCard: React.FC = () => {
  const { t } = useTranslation();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  useEffect(() => {
    // Загружаем домашние задания
    getHomeworksList()
      .then(setHomeworks)
      .catch((error) => {
        console.error('Failed to load homeworks:', error);
      });
  }, []);

  return (
    <DashboardCard title={t('medical-dashboard.news')}>
      <S.Wrapper>
        {homeworks.map((homework) => (
          <BaseArticle
            key={homework.id}
            imgUrl={homework.file}
            title={homework.title}
            date={new Date(homework.created_at).toLocaleDateString()}
            description={homework.description}
            avatar={homework.teacher_avatar}
            author={homework.teacher}
          />
        ))}
      </S.Wrapper>
    </DashboardCard>
  );
};

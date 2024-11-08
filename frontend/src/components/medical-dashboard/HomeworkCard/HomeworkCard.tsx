import React, { useEffect, useState } from 'react';
import { getHomeworksList, Homework } from '@app/constants/dashboardHomeworks';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import * as S from './HomeworkCard.styles';
import { useTranslation } from 'react-i18next';
import { BaseArticleNoImg } from '@app/components/common/BaseArticle/BaseArticle';

export const HomeworkCard: React.FC = () => {
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
          <BaseArticleNoImg
            key={homework.id}
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

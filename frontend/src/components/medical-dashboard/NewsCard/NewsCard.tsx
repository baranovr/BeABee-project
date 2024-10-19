import React from 'react';
import { dashboardHomeworks } from '@app/constants/dashboardHomeworks';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import * as S from './NewsCard.styles';
import { useTranslation } from 'react-i18next';
import { BaseArticle } from '@app/components/common/BaseArticle/BaseArticle';

export const NewsCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <DashboardCard title={t('medical-dashboard.news')}>
      <S.Wrapper>
        {dashboardHomeworks.map((advice, index) => (
          <BaseArticle
            key={index}
            imgUrl={advice.img}
            title={advice.title}
            date={advice.date}
            description={advice.text}
            avatar={advice.avatarUrl}
            author={advice.author}
            tags={advice.tags}
          />
        ))}
      </S.Wrapper>
    </DashboardCard>
  );
};

// HomeworkCard.tsx

import React, { useEffect, useState } from 'react';
import { getHomeworksList, Homework } from '@app/constants/dashboardHomeworks';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import * as S from './HomeworkCard.styles';
import { useTranslation } from 'react-i18next';
import { BaseArticleNoImg } from '@app/components/common/BaseArticle/BaseArticle';
import moment from 'moment';

export const HomeworkCard: React.FC = () => {
  const { t } = useTranslation();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  useEffect(() => {
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
            date={moment(homework.created_at).format('MM/DD/YYYY HH:mm')}
            description={homework.description}
            avatar={homework.teacher_avatar}
            author={homework.teacher}
            subject={homework.subject}
            type={homework.type}
            deadline={moment(homework.deadline).format('MM/DD/YYYY HH:mm')}
            addedBy={homework.added_by}
            forGroup={homework.for_group}
          />
        ))}
      </S.Wrapper>
    </DashboardCard>
  );
};

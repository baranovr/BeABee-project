import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityStoryItem } from './ActivityStoryItem/ActivityStoryItem';
import { UserActivity, getUserActivities } from '@app/api/activity.api';
import * as S from './ActivityStory.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const ActivityStory: React.FC = () => {
  const [story, setStory] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    getUserActivities()
      .then((res) => setStory(res))
      .catch((err) => console.error('Failed to fetch users:', err))
      .finally(() => setLoading(false));
  }, []);

  const refreshActivities = () => {
    getUserActivities()
      .then(setStory)
      .catch((error) => {
        console.error('Failed to fetch posts:', error);
      });
  };

  useEffect(() => {
    refreshActivities(); // Загружаем посты при монтировании
  }, []);

  const activityStory = useMemo(
    () =>
      story.map((item, index) => (
        <BaseCol key={index} span={24}>
          <ActivityStoryItem {...item} onDeleteSuccess={refreshActivities}/>
        </BaseCol>
      )),
    [story],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <S.Wrapper>
      <S.Title level={2}>{t('nft.activityStory')}</S.Title>
      <S.ActivityRow gutter={[26, 26]}>{activityStory}</S.ActivityRow>
    </S.Wrapper>
  );
};

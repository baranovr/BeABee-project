import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { PostsFeed } from '@app/components/apps/newsFeed/PostsFeed';

const HomeworksFeedPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <PostsFeed />
    </>
  );
};

export default HomeworksFeedPage;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { NewsFeed } from '@app/components/apps/newsFeed/NewsFeed';

const HomeworksFeedPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <NewsFeed />
    </>
  );
};

export default HomeworksFeedPage;

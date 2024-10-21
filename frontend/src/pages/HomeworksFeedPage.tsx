import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { HomeworksFeed } from '@app/components/apps/newsFeed/HomeworksFeed';

const HomeworksFeedPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <HomeworksFeed />
    </>
  );
};

export default HomeworksFeedPage;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { MyContent } from '@app/components/profile/profileCard/profileFormNav/nav/myContent/MyContent';

const MyContentPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('My Content')}</PageTitle>
      <MyContent />
    </>
  );
};

export default MyContentPage;

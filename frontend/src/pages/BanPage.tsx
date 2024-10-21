import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BanForm } from '@app/components/auth/BanForm/BanForm';

const BanPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.ban')}</PageTitle>
      <BanForm />
    </>
  );
};

export default BanPage;

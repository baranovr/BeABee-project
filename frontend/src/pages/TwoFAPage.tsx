import React from 'react';
import { useTranslation } from 'react-i18next';
import { TwoFactorForm } from '@app/components/auth/LoginForm/TwoFAForm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const TwoFAPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.twofactor')}</PageTitle>
      <TwoFactorForm />
    </>
  );
};

export default TwoFAPage;

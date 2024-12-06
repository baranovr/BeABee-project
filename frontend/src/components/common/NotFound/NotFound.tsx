import React from 'react';
import { useTranslation } from 'react-i18next';

import * as S from './NotFound.styles';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.NotFoundWrapper>
      <S.Text>{t('common.notFound')}</S.Text>
    </S.NotFoundWrapper>
  );
};

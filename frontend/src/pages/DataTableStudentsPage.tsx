import React from 'react';
import { StudentsTable } from '@app/components/tables/StudentsTable/StudentsTable';
import { useTranslation } from 'react-i18next';
import * as S from '@app/components/tables/Tables.styles';

export const StudentsTablePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="basic-table" title={t('tables.existStudentsTable')} padding="1.25rem 1.25rem 0">
          <StudentsTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default StudentsTablePage;

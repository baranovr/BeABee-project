import React from 'react';
import { HomeworksTable } from '@app/components/tables/HomeworksTable/HomeworksTable';
import { useTranslation } from 'react-i18next';
import * as S from '@app/components/tables/Tables.styles';

export const HomeworksTablePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="basic-table" title={'Existing homeworks table'} padding="1.25rem 1.25rem 0">
          <HomeworksTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default HomeworksTablePage;

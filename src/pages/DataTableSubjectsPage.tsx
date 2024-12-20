import React from 'react';
import { SubjectsTable } from '@app/components/tables/SubjectsTable/SubjectsTable';
import { useTranslation } from 'react-i18next';
import * as S from '@app/components/tables/Tables.styles';

export const SubjectsTablePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="tree-table" title={t('tables.treeTable')} padding="1.25rem 1.25rem 0">
          <SubjectsTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default SubjectsTablePage;

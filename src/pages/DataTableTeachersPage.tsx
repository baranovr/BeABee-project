import React from 'react';
import { EditableTeachersTable } from '@app/components/tables/editableTeachersTable/EditableTeachersTable';
import { useTranslation } from 'react-i18next';
import * as S from '@app/components/tables/Tables.styles';

export const TeachersTablePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="editable-table" title={t('tables.editableTable')} padding="1.25rem 1.25rem 0">
          <EditableTeachersTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default TeachersTablePage;

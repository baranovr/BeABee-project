import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { StudentsTablePage } from '@app/pages/DataTableStudentsPage';
import { TeachersTablePage } from '@app/pages/DataTableTeachersPage';

const DataTablesPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.dataTables')}</PageTitle>
      <StudentsTablePage />
      <TeachersTablePage />
    </>
  );
};

export default DataTablesPage;

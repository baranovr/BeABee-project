import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';

export const GroupItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="group" label={t('Group')}>
      <BaseInput />
    </BaseButtonsForm.Item>
  );
};

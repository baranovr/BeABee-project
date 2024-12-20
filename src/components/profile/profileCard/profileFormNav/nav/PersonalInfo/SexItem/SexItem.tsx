import React from 'react';
import { useTranslation } from 'react-i18next';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';

const SEX_OPTIONS = [
  {
    value: 'Male',
    label: 'profile.nav.personalInfo.male',
    icon: <ManOutlined />,
  },
  {
    value: 'Female',
    label: 'profile.nav.personalInfo.female',
    icon: <WomanOutlined />,
  },
];

interface SexItemProps {
  initialValue?: string;
}

export const SexItem: React.FC<SexItemProps> = ({ initialValue }) => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="sex" label={t('profile.nav.personalInfo.sex')} initialValue={initialValue}>
      <BaseSelect defaultValue={initialValue}>
        {SEX_OPTIONS.map((option) => (
          <Option key={option.value} value={option.value}>
            <BaseSpace align="center">
              {option.icon}
              {t(option.label)}
            </BaseSpace>
          </Option>
        ))}
      </BaseSelect>
    </BaseButtonsForm.Item>
  );
};

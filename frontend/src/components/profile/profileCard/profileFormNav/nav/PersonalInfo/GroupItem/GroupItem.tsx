import React from 'react';
import { useTranslation } from 'react-i18next';
import { TeamOutlined } from '@ant-design/icons';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';

const GROUP_OPTIONS = [
  { value: 'CS-31', label: 'CS-31' },
  { value: 'CS-32', label: 'CS-32' },
  { value: 'CS-33', label: 'CS-33' },
  { value: 'CS-34', label: 'CS-34' },
  { value: 'CS-41', label: 'CS-41' },
  { value: 'CS-42', label: 'CS-42' },
  { value: 'CS-43', label: 'CS-43' },
  { value: 'CS-44', label: 'CS-44' },
];

interface GroupItemProps {
  initialValue?: string;
}

export const GroupItem: React.FC<GroupItemProps> = ({ initialValue }) => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="group" label={t('Group')} initialValue={initialValue}>
      <BaseSelect defaultValue={initialValue}>
        {GROUP_OPTIONS.map((option) => (
          <Option key={option.value} value={option.value}>
            <BaseSpace align="center">
              <TeamOutlined />
              {option.label}
            </BaseSpace>
          </Option>
        ))}
      </BaseSelect>
    </BaseButtonsForm.Item>
  );
};

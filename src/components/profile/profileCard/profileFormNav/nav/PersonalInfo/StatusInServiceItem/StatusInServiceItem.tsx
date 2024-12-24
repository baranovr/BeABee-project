import React from 'react';
import { TeamOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { useAppSelector } from '@app/hooks/reduxHooks';

const STATUS_IN_SERVICE_OPTIONS = [
  { value: 'Creator', label: 'Creator', icon: <CrownOutlined /> },
  { value: 'Admin', label: 'Admin', icon: <TeamOutlined /> },
  { value: 'User', label: 'User', icon: <UserOutlined /> },
];

interface StatusItemProps {
  initialValue?: string;
}

export const StatusInServiceItem: React.FC<StatusItemProps> = ({ initialValue }) => {
  const { user } = useAppSelector((state) => state.user);
  const availableOptions = STATUS_IN_SERVICE_OPTIONS.filter((option) => user && option.value === user.statusInService);

  return (
    <BaseButtonsForm.Item name="statusInService" label={'Status in service'} initialValue={initialValue}>
      <BaseSelect defaultValue={initialValue}>
        {availableOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            <BaseSpace align="center">
              {option.icon}
              {option.label}
            </BaseSpace>
          </Option>
        ))}
      </BaseSelect>
    </BaseButtonsForm.Item>
  );
};

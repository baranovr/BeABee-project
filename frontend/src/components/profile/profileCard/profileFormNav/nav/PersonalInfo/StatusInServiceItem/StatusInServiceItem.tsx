import React from 'react';
import { useTranslation } from 'react-i18next';
import { TeamOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';

const STATUS_IN_SERVICE_OPTIONS = [
  { value: 'Creator', label: 'Creator', icon: <CrownOutlined /> },
  { value: 'Admin', label: 'Admin', icon: <TeamOutlined /> },
  { value: 'User', label: 'User', icon: <UserOutlined /> },
];

export const StatusInServiceItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="status_in_service" label={t('Status in service')}>
      <BaseSelect placeholder={t('common.select.placeholder')}>
        {STATUS_IN_SERVICE_OPTIONS.map((option) => (
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

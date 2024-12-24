import React from 'react';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import ChangePasswordForm from '@app/components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/ChangePasswordForm';

export const SecuritySettings: React.FC = () => (
  <BaseCard>
    <BaseRow gutter={[30, 0]}>
      <BaseCol xs={24} xl={10}>
        <ChangePasswordForm />
      </BaseCol>
    </BaseRow>
  </BaseCard>
);

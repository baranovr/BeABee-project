import React from 'react';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';

export const BanForm: React.FC = () => {
  return (
    <Auth.FormWrapper>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <h2>Your account has been blocked</h2>
        <p>Reason: Spam</p>
      </div>
    </Auth.FormWrapper>
  );
};

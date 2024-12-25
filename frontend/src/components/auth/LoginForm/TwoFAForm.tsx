import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { verify2FACode } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';

interface TwoFactorFormData {
  code: string;
}

const initValues: TwoFactorFormData = {
  code: '',
};

export const TwoFactorForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (values: TwoFactorFormData) => {
    setLoading(true);
    try {
      await dispatch(verify2FACode(values)).unwrap();
      notificationController.success({ message: 'Successfully logged in!' });
      navigate('/');
    } catch (err) {
      const error = err as Error;
      notificationController.error({
        message: error.message || 'Failed to verify code',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <Auth.FormTitle>Two-Factor Authentication</Auth.FormTitle>
        <p>Enter the verification code sent to your email address.</p>
        <Auth.FormItem
          name="code"
          label="Verification Code"
          rules={[
            {
              required: true,
              message: 'Please enter the verification code',
            },
            {
              len: 6,
              message: 'Verification code must be 6 digits',
            },
          ]}
        >
          <Auth.FormInput placeholder="Enter 6-digit code" maxLength={6} autoComplete="off" autoFocus />
        </Auth.FormItem>
        <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify & Login'}
        </Auth.SubmitButton>
      </BaseForm>
    </Auth.FormWrapper>
  );
};

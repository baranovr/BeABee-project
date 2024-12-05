import React from 'react';
import { Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@app/api/axiosInstance';
import { notificationController } from '@app/controllers/notificationController';
import { CurrentPasswordItem } from './CurrentPasswordItem';
import { NewPasswordItem } from './NewPasswordItem';
import { ConfirmItemPassword } from '@app/components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/ConfirmPasswordItem';

export const ChangePasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const response = await axiosInstance.post('user/my_profile/change-password/', {
        current_password: values.password,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });

      notificationController.success({
        message: response.data.message || t('profile.nav.securitySettings.passwordChanged'),
      });

      form.resetFields();
    } catch (error: any) {
      notificationController.error({
        message: error.response?.data?.error || t('profile.nav.securitySettings.passwordChangeError'),
      });
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <CurrentPasswordItem />
      <NewPasswordItem />
      <ConfirmItemPassword />

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {t('profile.nav.securitySettings.changePassword')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePasswordForm;

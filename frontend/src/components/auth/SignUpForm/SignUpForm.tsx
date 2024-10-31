import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doSignUp, RegisterData } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './SignUpForm.styles';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: File | null;
  username: string;
  sex: string;
  birthDate: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  group: string;
  statusInService: string;
}

const mapFormDataToRegisterData = (formData: SignUpFormData): RegisterData => {
  return {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    password: formData.password,
    avatar: formData.avatar,
    username: formData.username,
    sex: formData.sex,
    birth_date: formData.birthDate,
    phone_number: formData.phoneNumber,
    country: formData.country,
    city: formData.city,
    linkedin: formData.linkedin,
    facebook: formData.facebook,
    instagram: formData.instagram,
    github: formData.github,
    group: formData.group,
    status: formData.statusInService,
    about_me: 'No content',
  };
};

const SEX_CHOICES = {
  Male: 'Male',
  Female: 'Female',
} as const;

const GROUP_CHOICES = {
  CS_31: 'CS_31',
  CS_32: 'CS-32',
  CS_33: 'CS-33',
  CS_34: 'CS-34',
  CS_41: 'CS_41',
  CS_42: 'CS-42',
  CS_43: 'CS-43',
  CS_44: 'CS-44',
} as const;

const SERVICE_STATUS_CHOICES = {
  Creator: 'Creator',
  Admin: 'Admin',
  User: 'User',
} as const;

const initValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  avatar: null,
  sex: SEX_CHOICES.Male,
  birthDate: '2000-01-01',
  phoneNumber: '',
  country: '',
  city: '',
  linkedin: '',
  facebook: '',
  instagram: '',
  github: '',
  group: GROUP_CHOICES.CS_32,
  statusInService: SERVICE_STATUS_CHOICES.User,
  termOfUse: true,
};

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (values: SignUpFormData) => {
    setLoading(true);

    // Создаем объект FormData для правильной отправки файлов
    const formData = new FormData();

    // Добавляем все поля в FormData
    Object.entries(mapFormDataToRegisterData(values)).forEach(([key, value]) => {
      // Пропускаем пустые значения
      if (value !== undefined && value !== null && value !== '') {
        // Особая обработка для файла аватара
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value);
        }
        // Для всех остальных полей
        else {
          formData.append(key, value.toString());
        }
      }
    });

    dispatch(doSignUp(formData))
      .unwrap()
      .then(() => {
        notificationController.success({
          message: t('auth.signUpSuccessMessage'),
          description: t('auth.signUpSuccessDescription'),
        });
        navigate('/auth/login');
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
        initialValues={initValues}
        encType="multipart/form-data"
      >
        <S.Title>{t('common.signUp')}</S.Title>

        <Auth.FormItem
          name="avatar"
          label={t('common.avatar')}
          valuePropName="file" // Важно для правильной обработки файла
          getValueFromEvent={(e: any) => e?.target?.files?.[0]} // Получаем файл из события
        >
          <Auth.FormInput type="file" accept="image/*" />
        </Auth.FormItem>

        <Auth.FormItem name="username" label={t('Username')} rules={[{ required: true }]}>
          <Auth.FormInput placeholder={t('Username')} />
        </Auth.FormItem>

        <Auth.FormItem name="firstName" label={t('common.firstName')} rules={[{ required: true }]}>
          <Auth.FormInput placeholder={t('common.firstName')} />
        </Auth.FormItem>

        <Auth.FormItem name="lastName" label={t('common.lastName')} rules={[{ required: true }]}>
          <Auth.FormInput placeholder={t('common.lastName')} />
        </Auth.FormItem>

        <Auth.FormItem name="email" label={t('common.email')} rules={[{ required: true, type: 'email' }]}>
          <Auth.FormInput placeholder={t('common.email')} />
        </Auth.FormItem>

        <Auth.FormItem name="sex" label={t('Sex')} rules={[{ required: true }]}>
          <Auth.FormSelect
            options={[
              { value: SEX_CHOICES.Male, label: 'Male' },
              { value: SEX_CHOICES.Female, label: 'Female' },
            ]}
          />
        </Auth.FormItem>

        <Auth.FormItem name="birthDate" label={t('Birth Date')} rules={[{ required: true }]}>
          <Auth.FormInput type="date" placeholder={t('common.birthDate')} />
        </Auth.FormItem>

        <Auth.FormItem name="phoneNumber" label={t('Phone Number')}>
          <Auth.FormInput placeholder={t('Phone Number')} />
        </Auth.FormItem>

        <Auth.FormItem name="country" label={t('common.country')}>
          <Auth.FormInput placeholder={t('common.country')} />
        </Auth.FormItem>

        <Auth.FormItem name="city" label={t('common.city')}>
          <Auth.FormInput placeholder={t('common.city')} />
        </Auth.FormItem>

        <Auth.FormItem name="linkedin" label="LinkedIn">
          <Auth.FormInput placeholder="LinkedIn URL" />
        </Auth.FormItem>

        <Auth.FormItem name="facebook" label="Facebook">
          <Auth.FormInput placeholder="Facebook URL" />
        </Auth.FormItem>

        <Auth.FormItem name="instagram" label="Instagram">
          <Auth.FormInput placeholder="Instagram URL" />
        </Auth.FormItem>

        <Auth.FormItem name="github" label="GitHub">
          <Auth.FormInput placeholder="GitHub URL" />
        </Auth.FormItem>

        <Auth.FormItem name="group" label={t('Group')} rules={[{ required: true }]}>
          <Auth.FormSelect
            options={[
              { value: GROUP_CHOICES.CS_31, label: 'CS_31' },
              { value: GROUP_CHOICES.CS_32, label: 'CS-32' },
              { value: GROUP_CHOICES.CS_33, label: 'CS-33' },
              { value: GROUP_CHOICES.CS_34, label: 'CS-34' },
              { value: GROUP_CHOICES.CS_41, label: 'CS_41' },
              { value: GROUP_CHOICES.CS_42, label: 'CS-42' },
              { value: GROUP_CHOICES.CS_43, label: 'CS-43' },
              { value: GROUP_CHOICES.CS_44, label: 'CS-44' },
            ]}
            placeholder={t('common.selectGroup')}
          />
        </Auth.FormItem>

        <Auth.FormItem name="statusInService" label={t('Status In Service')} rules={[{ required: true }]}>
          <Auth.FormSelect
            options={[
              { value: SERVICE_STATUS_CHOICES.User, label: 'User' },
              { value: SERVICE_STATUS_CHOICES.Admin, label: 'Admin' },
              { value: SERVICE_STATUS_CHOICES.Creator, label: 'Creator' },
            ]}
            placeholder={t('common.statusInService')}
          />
        </Auth.FormItem>

        <Auth.FormItem name="password" label={t('common.password')} rules={[{ required: true, min: 8 }]}>
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Auth.FormItem>

        <Auth.FormItem
          label={t('common.confirmPassword')}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('common.confirmPasswordError')));
              },
            }),
          ]}
        >
          <Auth.FormInputPassword placeholder={t('common.confirmPassword')} />
        </Auth.FormItem>

        {/* Остальные элементы формы */}
        <Auth.ActionsWrapper>
          <BaseForm.Item name="termOfUse" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <Auth.Text>
                {t('signup.agree')}{' '}
                <Link to="/" target={'_blank'}>
                  <Auth.LinkText>{t('signup.termOfUse')}</Auth.LinkText>
                </Link>{' '}
                and{' '}
                <Link to="/" target={'_blank'}>
                  <Auth.LinkText>{t('signup.privacyPolicy')}</Auth.LinkText>
                </Link>
              </Auth.Text>
            </Auth.FormCheckbox>
          </BaseForm.Item>
        </Auth.ActionsWrapper>

        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.signUp')}
          </Auth.SubmitButton>
        </BaseForm.Item>

        <Auth.FooterWrapper>
          <Auth.Text>
            {t('signup.alreadyHaveAccount')}{' '}
            <Link to="/auth/login">
              <Auth.LinkText>{t('common.here')}</Auth.LinkText>
            </Link>
          </Auth.Text>
        </Auth.FooterWrapper>
      </BaseForm>
    </Auth.FormWrapper>
  );
};

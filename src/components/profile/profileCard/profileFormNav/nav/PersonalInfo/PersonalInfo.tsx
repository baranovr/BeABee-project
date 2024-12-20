import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { FirstNameItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/FirstNameItem/FirstNameItem';
import { LastNameItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/LastNameItem/LastNameItem';
import { NicknameItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/NicknameItem/NicknameItem';
import { SexItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/SexItem/SexItem';
import { BirthdayItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/BirthdayItem/BirthdayItem';
import { GroupItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/GroupItem/GroupItem';
import { PhoneItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/PhoneItem/PhoneItem';
import { EmailItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/EmailItem/EmailItem';
import { CountriesItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/CountriesItem/CountriesItem';
import { CitiesItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/CitiesItem/CitiesItem';
import { SocialLinksItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/SocialLinksItem/SocialLinksItem';
import { StatusInServiceItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/StatusInServiceItem/StatusInServiceItem';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import {
  selectUserLoading,
  updateUserProfile,
  selectUpdateSuccess,
  selectUserError,
} from '@app/store/slices/userSlice';
import dayjs from 'dayjs';

interface PersonalInfoFormValues {
  birthday?: string;
  lastName: string;
  country?: string;
  city?: string;
  nickName: string;
  sex: string;
  facebook: string;
  linkedin: string;
  firstName: string;
  instagram: string;
  github: string;
  phone: string;
  email: string;
  group: string;
  statusInService: string;
}

const initialPersonalInfoValues: PersonalInfoFormValues = {
  firstName: '',
  lastName: '',
  nickName: '',
  sex: '',
  birthday: undefined,
  phone: '',
  email: '',
  country: undefined,
  city: undefined,
  instagram: '',
  linkedin: '',
  facebook: '',
  github: '',
  group: '',
  statusInService: '',
};

export const PersonalInfo: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user.user);
  const loading = useSelector(selectUserLoading);
  useSelector(selectUpdateSuccess);
  const error = useSelector(selectUserError);

  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [form] = BaseButtonsForm.useForm();

  const userFormValues = useMemo(
    () =>
      user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            nickName: user.nickName,
            email: user.email,
            phone: user.phone,
            birthday: Dates.getDate(user.birthday),
            country: user.country,
            city: user.city,
            group: user?.group,
            sex: user.sex,
            instagram: user?.instagram,
            facebook: user?.facebook,
            linkedin: user?.linkedin,
            github: user?.github,
            statusInService: user.statusInService,
          }
        : initialPersonalInfoValues,
    [user],
  );

  const handleSubmit = async (values: PersonalInfoFormValues) => {
    try {
      // Создаем копию значений для модификации
      const formattedValues = { ...values };

      // Если есть дата рождения, форматируем её в нужный формат
      if (formattedValues.birthday) {
        formattedValues.birthday = dayjs(formattedValues.birthday).format('YYYY-MM-DD');
      }

      await dispatch(updateUserProfile(formattedValues));

      if (!error) {
        notificationController.success({ message: t('common.success') });
      } else {
        notificationController.error({ message: error });
      }
    } catch (err) {
      notificationController.error({ message: t('common.error') });
    }
  };

  return (
    <BaseCard>
      <BaseButtonsForm
        form={form}
        name="info"
        loading={loading}
        initialValues={userFormValues}
        isFieldsChanged={isFieldsChanged}
        setFieldsChanged={setFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        onSubmit={handleSubmit}
      >
        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('profile.nav.personalInfo.title')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <FirstNameItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <LastNameItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <NicknameItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <SexItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BirthdayItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <GroupItem />
          </BaseCol>

          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('profile.nav.personalInfo.contactInfo')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <EmailItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <PhoneItem />
          </BaseCol>

          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('common.address')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <CountriesItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <CitiesItem />
          </BaseCol>

          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('common.social_media_links')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol span={24}>
            <SocialLinksItem />
          </BaseCol>

          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('common.statuses')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <StatusInServiceItem />
          </BaseCol>
        </BaseRow>
      </BaseButtonsForm>
    </BaseCard>
  );
};

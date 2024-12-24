import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UserModel } from '@app/domain/UserModel';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import * as S from './ProfileInfo.styles';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { uploadAvatar } from '@app/store/slices/userSlice';

export const ProfileInfo: React.FC<{ profileData: UserModel | null }> = ({ profileData }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!profileData) {
    return null;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await dispatch(uploadAvatar(file));
      event.target.value = ''; // сброс значения input после выбора файла

      // Перезагрузка страницы после успешного обновления аватара
      window.location.reload();
    }
  };

  const calculateProfileFullness = (profileData: UserModel | null): number => {
    if (!profileData) return 0;

    const totalFields = 15;
    let filledFields = 0;

    if (profileData.firstName) filledFields++;
    if (profileData.lastName) filledFields++;
    if (profileData.nickName) filledFields++;
    if (profileData.sex) filledFields++;
    if (profileData.birthday) filledFields++;
    if (profileData.group) filledFields++;
    if (profileData.email) filledFields++;
    if (profileData.phone) filledFields++;
    if (profileData.country) filledFields++;
    if (profileData.city) filledFields++;
    if (profileData.instagram) filledFields++;
    if (profileData.linkedin) filledFields++;
    if (profileData.facebook) filledFields++;
    if (profileData.github) filledFields++;
    if (profileData.statusInService) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const fullness = calculateProfileFullness(profileData);

  return (
    <S.Wrapper>
      <S.ImgWrapper onClick={handleAvatarClick} title="Click to change avatar">
        <BaseAvatar shape="circle" src={profileData?.imgUrl} alt="Profile" />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </S.ImgWrapper>
      <S.Title>{`${profileData?.firstName} ${profileData?.lastName}`}</S.Title>
      <S.Subtitle>{profileData?.nickName}</S.Subtitle>
      <S.FullnessWrapper>
        <S.FullnessLine width={fullness}>{fullness}%</S.FullnessLine>
      </S.FullnessWrapper>
      <S.Text>{t('profile.fullness')}</S.Text>
    </S.Wrapper>
  );
};

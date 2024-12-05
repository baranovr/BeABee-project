import React, { useState, useEffect } from 'react';
import { Modal, Spin, Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import * as S from './UserProfileModal.styles';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import axiosInstance from '@app/api/axiosInstance';
import { notificationController } from '@app/controllers/notificationController';
import { UserOutlined, CrownOutlined, TeamOutlined } from '@ant-design/icons';
import { useAppSelector } from '@app/hooks/reduxHooks';

const { Option } = Select;

interface UserProfileModalProps {
  userId: number;
  isVisible: boolean;
  onClose: () => void;
}

interface UserProfileDetails {
  id: number;
  avatar: string;
  nickname: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  sex: string;
  birth_date: string;
  phone_number: string;
  country: string;
  city: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  github: string;
  group: string;
  status_in_service: string;
}

const renderSocialLinks = (user: UserProfileDetails) => {
  const socialNetworks = [
    { name: 'LinkedIn', url: user.linkedin },
    { name: 'Facebook', url: user.facebook },
    { name: 'Instagram', url: user.instagram },
    { name: 'GitHub', url: user.github },
  ];

  return socialNetworks
    .filter((network) => network.url) // Исключаем пустые ссылки
    .map((network, index) => (
      <span key={index}>
        <a href={network.url} target="_blank" rel="noopener noreferrer">
          {network.name}
        </a>
        {index < socialNetworks.length - 1 && ' | '}
      </span>
    ));
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, isVisible, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState<UserProfileDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFullInfoModalVisible, setFullInfoModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isVisible && userId) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`user/users/${userId}/`);
          setUserDetails(response.data);
        } catch (error) {
          notificationController.error({
            message: 'Failed to load user details',
            description: 'Unable to retrieve user information. Please try again later.',
          });
          onClose();
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [isVisible, userId]);

  const handleStatusChange = async () => {
    if (!newStatus || !userDetails) return;

    try {
      await axiosInstance.patch(`user/users/${userDetails.id}/`, { status_in_service: newStatus });
      setUserDetails({ ...userDetails, status_in_service: newStatus });
      notificationController.success({
        message: 'Status updated successfully',
      });
    } catch (error) {
      notificationController.error({
        message: 'Failed to update status',
        description: 'An error occurred while updating the status. Please try again.',
      });
    }
  };

  const calculateProfileFullness = (userData: UserProfileDetails): number => {
    if (!userData) return 0;

    const totalFields = 15;
    let filledFields = 0;

    const fieldsToCheck: (keyof UserProfileDetails)[] = [
      'first_name',
      'last_name',
      'nickname',
      'sex',
      'birth_date',
      'group',
      'email',
      'phone_number',
      'country',
      'city',
      'instagram',
      'linkedin',
      'facebook',
      'github',
      'status_in_service',
    ];

    fieldsToCheck.forEach((field) => {
      if (userData[field]) filledFields++;
    });

    return Math.round((filledFields / totalFields) * 100);
  };

  const canEditStatus = (): boolean => {
    if (!userDetails || !user) return false;

    const currentUserStatus = user.statusInService;
    const targetUserStatus = userDetails.status_in_service;

    if (currentUserStatus === 'Creator') {
      return true;
    }

    if (currentUserStatus === 'User') {
      return false;
    }

    if (currentUserStatus === 'Admin') {
      if (targetUserStatus === 'Admin' || targetUserStatus === 'Creator') {
        return false;
      }
      if (targetUserStatus === 'User') {
        return true;
      }
    }

    return false;
  };

  if (loading) {
    return (
      <Modal visible={isVisible} onCancel={onClose} footer={null} centered>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  if (!userDetails) return null;

  const fullness = calculateProfileFullness(userDetails);
  const openFullInfoModal = () => setFullInfoModalVisible(true);
  const closeFullInfoModal = () => setFullInfoModalVisible(false);

  return (
    <>
      <Modal title={null} footer={null} visible={isVisible} onCancel={onClose} width={400} centered>
        <S.Wrapper>
          <S.ImgWrapper>
            <BaseAvatar shape="circle" src={`${process.env.REACT_APP_BASE_URL}${userDetails.avatar}`} alt="Profile" />
          </S.ImgWrapper>
          <S.Title>{userDetails.full_name}</S.Title>
          <S.Subtitle>{userDetails.nickname}</S.Subtitle>

          <S.Text>{'fullness of profile'}</S.Text>
          <S.FullnessWrapper>
            <S.FullnessLine width={fullness}>{fullness}%</S.FullnessLine>
          </S.FullnessWrapper>

          <Button type="primary" onClick={openFullInfoModal}>
            {t('View Full Info')}
          </Button>
        </S.Wrapper>
      </Modal>

      <Modal
        title={null}
        visible={isFullInfoModalVisible}
        onCancel={closeFullInfoModal}
        footer={null}
        width={600}
        centered
      >
        <S.FullInfoWrapper>
          <S.FullInfoHeader>{t('Full User Information')}</S.FullInfoHeader>

          <S.FullInfoSection>
            <S.FullInfoLabel>{t('Name')}: </S.FullInfoLabel>
            <S.FullInfoContent>{userDetails.full_name}</S.FullInfoContent>
          </S.FullInfoSection>

          <S.FullInfoSection>
            <S.FullInfoLabel>{t('Country & City')}: </S.FullInfoLabel>
            <S.FullInfoContent>
              {userDetails.country}, {userDetails.city}
            </S.FullInfoContent>
          </S.FullInfoSection>

          <S.FullInfoSection>
            <S.FullInfoLabel>{t('Birth date')}: </S.FullInfoLabel>
            <S.FullInfoContent>{userDetails.birth_date}</S.FullInfoContent>
          </S.FullInfoSection>

          <S.FullInfoSection>
            <S.FullInfoLabel>{t('Group')}: </S.FullInfoLabel>
            <S.FullInfoContent>{userDetails.group}</S.FullInfoContent>
          </S.FullInfoSection>

          <S.FullInfoSection>
            <S.FullInfoLabel>{t('Email')}: </S.FullInfoLabel>
            <S.FullInfoContent>{userDetails.email}</S.FullInfoContent>
          </S.FullInfoSection>

          <S.FullInfoSection>
            <S.FullInfoLabel>{t('Status in Service')}: </S.FullInfoLabel>
            <S.FullInfoContent>{userDetails.status_in_service}</S.FullInfoContent>
          </S.FullInfoSection>

          <S.FullInfoSection>
            <S.FullInfoLabel>{t('Social Links')}:</S.FullInfoLabel>
            <S.FullInfoLinks>{renderSocialLinks(userDetails)}</S.FullInfoLinks>
          </S.FullInfoSection>

          {canEditStatus() && (
            <>
              <Select
                placeholder={t('Change Status')}
                style={{ width: '100%', marginTop: '10px' }}
                value={newStatus || userDetails.status_in_service}
                onChange={(value) => setNewStatus(value)}
              >
                {user && user.statusInService === 'Creator' && (
                  <>
                    <Option value="Creator">
                      <CrownOutlined style={{ marginRight: '8px', color: 'gold' }} />
                      {t('Creator')}
                    </Option>
                    <Option value="Admin">
                      <TeamOutlined style={{ marginRight: '8px', color: 'red' }} />
                      {t('Admin')}
                    </Option>
                    <Option value="User">
                      <UserOutlined style={{ marginRight: '8px', color: 'blue' }} />
                      {t('User')}
                    </Option>
                  </>
                )}
                {user && user.statusInService === 'Admin' && userDetails.status_in_service === 'User' && (
                  <Option value="Admin">
                    <TeamOutlined style={{ marginRight: '8px', color: 'blue' }} />
                    {t('Admin')}
                  </Option>
                )}
              </Select>
              <Button type="primary" style={{ marginTop: '10px' }} onClick={handleStatusChange}>
                {t('Update Status')}
              </Button>
            </>
          )}
        </S.FullInfoWrapper>
      </Modal>
    </>
  );
};

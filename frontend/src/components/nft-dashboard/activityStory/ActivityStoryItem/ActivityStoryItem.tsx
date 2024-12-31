import React, { useState } from 'react';
import { Modal, Select, message, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { activityStatuses } from '@app/constants/config/activityStatuses';
import { UserActivity } from '@app/api/activity.api';
import { Dates } from '@app/constants/Dates';
import * as S from './ActivityStoryItem.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import axiosInstance from '@app/api/axiosInstance';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getBansList } from '@app/api/bans.api';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { UserProfileModal } from '@app/components/nft-dashboard/activityStory/ActivityStoryItem/UserProfileModal';

const BanReasons = [
  { value: 'Insulting community members', label: 'Insulting community members' },
  { value: 'Publishing obscene content', label: 'Publishing obscene content' },
  { value: 'Spam', label: 'Spam' },
];

const { Text, Title } = Typography;

const CustomModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .anticon {
    font-size: 24px;
    color: #ff4d4f;
  }
`;

const StyledSelect = styled(Select)`
  margin-top: 16px;

  .ant-select-selector {
    height: 48px;
    font-size: 16px;
  }
`;

export const ActivityStoryItem: React.FC<UserActivity> = ({
  id,
  avatar,
  full_name,
  status_in_service,
  date_joined,
  group,
  is_banned,
  onDeleteSuccess,
}) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);

  // Permission check function
  const canBanOrUnban = () => {
    if (!user) return false;

    // User cannot ban/unban anyone
    if (user.statusInService === 'User') return false;

    // Admin can only ban Users
    if (user.statusInService === 'Admin' && status_in_service !== 'User') return false;

    // Creator can ban anyone except other Creators
    if (user.statusInService === 'Creator' && status_in_service === 'Creator') return false;

    return true;
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | undefined>();
  const [loading, setLoading] = useState(false); // Для индикатора загрузки

  const currentStatus = activityStatuses.find((configStatus) => configStatus.name === status_in_service);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!selectedReason) {
      message.error('Please select a reason for banning the user.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('platform/bans/', {
        user: id,
        reason: selectedReason,
      });

      notificationController.success({ message: `User ${full_name} has been banned.` });
    } catch (error) {
      console.error(error);
      notificationController.error({ message: 'Failed to ban the user. Please try again later.' });
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleUnban = async () => {
    setLoading(true);

    try {
      // Assuming you want to unban based on the ban's ID
      const banToRemove = await getBansList().then((bans) => bans.find((ban) => ban.user === id));

      if (banToRemove) {
        await axiosInstance.delete(`platform/bans/${banToRemove.id}/`);
        notificationController.success({ message: `User ${full_name} has been unbanned.` });

        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        message.error('No active ban found for this user.');
      }
    } catch (error) {
      console.error(error);
      notificationController.error({ message: 'Failed to unban the user. Please try again later.' });
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleImageClick = () => {
    // Проверяем права перед выполнением действия
    if (!canBanOrUnban()) {
      notificationController.error({
        message: 'You do not have permissions to ban or unban this user!',
      });
      return;
    }

    if (is_banned) {
      // If user is already banned, show unban confirmation
      Modal.confirm({
        title: 'Unban User',
        icon: <ExclamationCircleOutlined />,
        content: `Are you sure you want to unban ${full_name}?`,
        okText: 'Confirm Unban',
        okButtonProps: { danger: true },
        onOk: handleUnban,
      });
    } else {
      // If user is not banned, show original ban modal
      showModal();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const handleFullNameClick = () => {
    setIsProfileModalVisible(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalVisible(false);
  };

  return (
    <BaseRow gutter={[20, 20]} wrap={false} align="middle">
      <BaseCol>
        <img
          width={80}
          height={80}
          src={`${process.env.REACT_APP_BASE_URL}${avatar}`}
          alt={full_name}
          style={{
            cursor: canBanOrUnban() ? 'pointer' : 'not-allowed',
          }}
          onClick={handleImageClick}
        />
      </BaseCol>

      <BaseCol flex={1}>
        <BaseRow justify="space-between" wrap={false}>
          <BaseCol>
            <BaseRow gutter={[16, 16]}>
              <BaseCol span={24}>
                <S.Title onClick={handleFullNameClick} style={{ cursor: 'pointer' }}>
                  {full_name}
                  {is_banned && (
                    <Text
                      type="danger"
                      style={{
                        marginLeft: '10px',
                        fontSize: '0.7em',
                        verticalAlign: 'super',
                      }}
                    >
                      (BANNED)
                    </Text>
                  )}
                </S.Title>

                <UserProfileModal userId={id} isVisible={isProfileModalVisible} onClose={handleProfileModalClose} />
              </BaseCol>
              <BaseCol span={24}>
                <S.Status
                  $color={currentStatus?.color || 'primary'}
                  $role={status_in_service as 'Creator' | 'Admin' | 'User'}
                >
                  {t(`${status_in_service}`)}
                </S.Status>
              </BaseCol>
            </BaseRow>
          </BaseCol>

          <BaseCol span={8}>
            <BaseRow gutter={[16, 16]}>
              <BaseCol span={24}>
                <S.DateText>{Dates.getDate(date_joined).format('ll')}</S.DateText>
              </BaseCol>

              <BaseCol span={24}>
                <S.Text>{group}</S.Text>
              </BaseCol>
            </BaseRow>
          </BaseCol>
        </BaseRow>
      </BaseCol>

      <Modal
        title={
          <CustomModalTitle>
            <ExclamationCircleOutlined />
            <span>Ban User</span>
          </CustomModalTitle>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Confirm Ban"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        cancelButtonProps={{ type: 'default' }}
      >
        <Title level={5}>Are you sure you want to ban this user?</Title>
        <Text type="warning">Please select the reason for banning the user. This action can be undone.</Text>
        <StyledSelect
          style={{ width: '100%' }}
          placeholder="Select reason"
          options={BanReasons}
          onChange={(value: any) => setSelectedReason(value)}
          value={selectedReason}
        />
      </Modal>
    </BaseRow>
  );
};

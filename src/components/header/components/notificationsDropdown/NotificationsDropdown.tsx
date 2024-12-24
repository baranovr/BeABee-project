import React, { useState, useEffect } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseBadge } from '@app/components/common/BaseBadge/BaseBadge';
import { NotificationsOverlay } from '@app/components/header/components/notificationsDropdown/NotificationsOverlay/NotificationsOverlay';
import { SystemNotificationModal } from './SystemNotificationModal';
import { SystemNotification } from '@app/api/sys_notifications.api';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { Row, Col } from 'antd';
import axiosInstance from '@app/api/axiosInstance';

export const NotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isOpened, setOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get<SystemNotification[]>('platform/system_notifications/');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((notification) => !notification.is_read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await axiosInstance.post('platform/system_notifications/mark_all_as_read/');

      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        is_read: true,
      }));

      setNotifications(updatedNotifications);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await axiosInstance.delete('platform/system_notifications/delete_all/');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  };

  return (
    <Row align="middle" gutter={8}>
      <Col>
        <BasePopover
          trigger="click"
          content={
            <NotificationsOverlay
              notifications={notifications}
              setNotifications={setNotifications}
              onMarkAllRead={handleMarkAllAsRead}
              onDeleteAll={handleDeleteAllNotifications}
            />
          }
          onOpenChange={setOpened}
        >
          <HeaderActionWrapper>
            <BaseButton
              type={isOpened ? 'ghost' : 'text'}
              icon={
                <BaseBadge count={unreadCount} dot={unreadCount > 0}>
                  <BellOutlined />
                </BaseBadge>
              }
            />
          </HeaderActionWrapper>
        </BasePopover>
      </Col>
      <Col>
        <SystemNotificationModal onNotificationCreated={fetchNotifications} />
      </Col>
    </Row>
  );
};

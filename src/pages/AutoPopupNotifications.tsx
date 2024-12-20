import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { SystemNotification } from '@app/api/sys_notifications.api';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { typeMapping } from '@app/api/sys_notifications.api';
import axiosInstance from '@app/api/axiosInstance';

export const AutoPopupNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<SystemNotification | null>(null);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await axiosInstance.get<SystemNotification[]>('platform/system_notifications/');

        // Фильтруем уведомления, которые еще не просмотрены
        const unreadNotifications = response.data.filter((notification) => !notification.is_read);

        setNotifications(unreadNotifications);

        // Показываем первое непросмотренное уведомление
        if (unreadNotifications.length > 0) {
          setCurrentNotification(unreadNotifications[0]);
        }
      } catch (error) {
        console.error('Error receiving notifications:', error);
      }
    };

    fetchUnreadNotifications();
  }, []);

  const handleClose = async () => {
    if (currentNotification) {
      try {
        // Показываем следующее уведомление, если есть
        const nextNotification = notifications.find((n) => n.id !== currentNotification.id);
        setNotifications((prev) => prev.filter((n) => n.id !== currentNotification.id));
        setCurrentNotification(nextNotification || null);
      } catch (error) {
        console.error('Notification deletion Error:', error);
      }
    }
  };

  return (
    <Modal
      open={!!currentNotification}
      onCancel={handleClose}
      footer={null}
      closable={true}
      title="System notification"
    >
      {currentNotification && (
        <BaseNotification
          type={typeMapping[currentNotification.type] || 'warning'}
          title={currentNotification.type}
          description={currentNotification.description}
        />
      )}
    </Modal>
  );
};

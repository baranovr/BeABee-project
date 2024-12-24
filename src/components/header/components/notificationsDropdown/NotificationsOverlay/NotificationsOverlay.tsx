import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { capitalize } from '@app/utils/utils';
import { SystemNotification } from 'api/sys_notifications.api';
import { typeMapping } from 'api/sys_notifications.api';
import * as S from './NotificationsOverlay.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface NotificationsOverlayProps {
  notifications: SystemNotification[];
  setNotifications: (state: SystemNotification[]) => void;
  onMarkAllRead?: () => void;
  onDeleteAll?: () => void;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({
  notifications,
  setNotifications,
  onMarkAllRead,
  onDeleteAll,
  ...props
}) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);

  const noticesList = useMemo(
    () =>
      notifications.map((notification, index) => {
        const type = typeMapping[notification.type] || 'warning';

        return (
          <BaseNotification key={index} type={type} title={capitalize(type)} description={notification.description} />
        );
      }),
    [notifications, t],
  );

  return (
    <S.NoticesOverlayMenu {...props}>
      <BaseRow gutter={[20, 20]}>
        <BaseCol span={24}>
          {notifications.length > 0 ? (
            <BaseSpace direction="vertical" size={10} split={<S.SplitDivider />}>
              {noticesList}
            </BaseSpace>
          ) : (
            <S.Text>{t('header.notifications.noNotifications')}</S.Text>
          )}
        </BaseCol>
        <BaseCol span={24}>
          <BaseRow gutter={[10, 10]}>
            {notifications.length > 0 && (
              <BaseCol span={24}>
                <S.Btn
                  type="ghost"
                  onClick={() => {
                    onMarkAllRead?.();
                  }}
                >
                  {t('header.notifications.readAll')}
                </S.Btn>
              </BaseCol>
            )}
            {user && user.statusInService === 'Creator' && (
              <BaseCol span={24}>
                <S.Btn
                  type="ghost"
                  onClick={() => {
                    onDeleteAll?.();
                  }}
                >
                  {'Delete All'}
                </S.Btn>
              </BaseCol>
            )}
          </BaseRow>
        </BaseCol>
      </BaseRow>
    </S.NoticesOverlayMenu>
  );
};

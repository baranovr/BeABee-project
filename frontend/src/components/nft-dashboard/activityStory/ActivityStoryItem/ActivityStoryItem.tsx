import React from 'react';
import { useTranslation } from 'react-i18next';
import { activityStatuses } from '@app/constants/config/activityStatuses';
import { UserActivity } from '@app/api/activity.api';
import { Dates } from '@app/constants/Dates';
import * as S from './ActivityStoryItem.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const ActivityStoryItem: React.FC<UserActivity> = ({
  avatar,
  full_name,
  status_in_service,
  date_joined,
  group,
}) => {
  const { t } = useTranslation();

  const currentStatus = activityStatuses.find((configStatus) => configStatus.name === status_in_service);

  return (
    <BaseRow gutter={[20, 20]} wrap={false} align="middle">
      <BaseCol>
        <img width={80} height={80} src={`${process.env.REACT_APP_BASE_URL}${avatar}`} alt={full_name} />
      </BaseCol>

      <BaseCol flex={1}>
        <BaseRow justify="space-between" wrap={false}>
          <BaseCol>
            <BaseRow gutter={[16, 16]}>
              <BaseCol span={24}>
                <S.Title>{full_name}</S.Title>
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
                <S.DateText>{Dates.getDate(date_joined).format('L')}</S.DateText>
              </BaseCol>

              <BaseCol span={24}>
                <S.Text>{group}</S.Text>
              </BaseCol>
            </BaseRow>
          </BaseCol>
        </BaseRow>
      </BaseCol>
    </BaseRow>
  );
};

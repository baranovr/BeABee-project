import React, { useState } from 'react';
import { Activity, getActivities } from '@app/api/activity.api';
import { RecentActivityHeader } from '@app/components/nft-dashboard/recentActivity/RecentActivityHeader/RecentActivityHeader';
import { RecentActivityFeed } from '@app/components/nft-dashboard/recentActivity/recentActivityFeed/RecentActivityFeed';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Button } from "antd";
import styled from 'styled-components';
import {Loading} from "@app/components/common/Loading/Loading";

export interface RecentActivityFilterState {
  status: string[];
}

const LoadButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  
  img {
    width: 100%;
    height: 100%;
  }
`;

export const RecentActivity: React.FC = () => {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [filteredActivity, setFilteredActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMore] = useState(true);

  const [filters, setFilters] = useState<RecentActivityFilterState>({
    status: [],
  });

  // Загрузка активности
  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const data = await getActivities();
      setActivity(data);
      setFilteredActivity(data);
      setIsVisible(true);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  // Загрузка дополнительных данных
  const next = async () => {
    try {
      const newActivities = await getActivities();
      setActivity(prev => [...prev, ...newActivities]);

      // Обновляем отфильтрованные активности
      if (filters.status.length > 0) {
        setFilteredActivity(prev => [
          ...prev,
          ...newActivities.filter(item =>
            filters.status.some(filter => filter === item.status)
          )
        ]);
      } else {
        setFilteredActivity(prev => [...prev, ...newActivities]);
      }
    } catch (error) {
      console.error('Failed to load more activities:', error);
    }
  };

  // Обработка фильтров
  React.useEffect(() => {
    if (activity.length > 0) {
      if (filters.status.length > 0) {
        setFilteredActivity(
          activity.filter(item =>
            filters.status.some(filter => filter === item.status)
          )
        );
      } else {
        setFilteredActivity(activity);
      }
    }
  }, [filters.status, activity]);

  const renderLoadingState = () => (
    <SpinnerWrapper>
      <Loading />
    </SpinnerWrapper>
  );

  const renderLoadButton = () => (
    <Button
      onClick={loadActivities}
      disabled={isLoading}
      className="w-full max-w-md"
    >
      Load Latest Activities
    </Button>
  );

  return (
    <BaseRow gutter={[30, 0]}>
      {!isVisible && (
        <BaseCol span={24}>
          <LoadButtonWrapper>
            {isLoading ? renderLoadingState() : renderLoadButton()}
          </LoadButtonWrapper>
        </BaseCol>
      )}

      {isVisible && (
        <>
          <BaseCol span={24}>
            <RecentActivityHeader
              filters={filters}
              setFilters={setFilters}
            />
          </BaseCol>

          <BaseCol xs={24} sm={24} md={24} xl={16}>
            <RecentActivityFeed
              activity={filteredActivity}
              hasMore={hasMore}
              next={next}
            />
          </BaseCol>
        </>
      )}
    </BaseRow>
  );
};

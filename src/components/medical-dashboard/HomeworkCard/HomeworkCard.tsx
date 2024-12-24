import React, { useState } from 'react';
import { getHomeworksList, Homework } from '@app/constants/dashboardHomeworks';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import { useTranslation } from 'react-i18next';
import { HomeworkTeacher } from '@app/components/common/BaseArticle/BaseArticle';
import { Loading } from '@app/components/common/Loading/Loading';
import { Button } from 'antd';
import styled from 'styled-components';

// Стили
const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1.25rem;
`;

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
  width: 24px;
  height: 24px;
`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const HomeworkCard: React.FC = () => {
  const { t } = useTranslation();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const loadHomeworks = async () => {
    try {
      setIsLoading(true);
      await sleep(500);
      const data = await getHomeworksList();
      setHomeworks(data);
      setIsVisible(true);
    } catch (error) {
      console.error('Failed to load homeworks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardCard title={t('medical-dashboard.news')}>
      {!isVisible ? (
        <LoadButtonWrapper>
          <Button onClick={loadHomeworks} disabled={isLoading} className="w-full max-w-md">
            {isLoading ? (
              <SpinnerWrapper>
                <Loading />
              </SpinnerWrapper>
            ) : (
              'Load Homeworks'
            )}
          </Button>
        </LoadButtonWrapper>
      ) : (
        <Wrapper>
          {homeworks.map((homework) => (
            <HomeworkTeacher key={homework.id} homework={homework} />
          ))}
        </Wrapper>
      )}
    </DashboardCard>
  );
};

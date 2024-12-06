// ExamCard.tsx

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from 'hooks/useResponsive';
import { ExamCalendar } from './ExamCalendar/ExamCalendar';
import { AppDate, Dates } from 'constants/Dates';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { BaseButton } from '../../common/BaseButton/BaseButton';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { Exam, getExams } from '@app/api/exams.api';
import { ExamTeacher } from '@app/components/medical-dashboard/treatmentCard/ExamTeacher/ExamTeacher';
import { ExamNotFound } from './ExamNotFound/ExamNotFound';

export const ExamCard: React.FC = () => {
  const { isTablet } = useResponsive();

  const [selectedDate, setDate] = useState<AppDate>(Dates.getToday());
  const [isDateClicked, setDateClicked] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);

  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user?.id) {
      getExams().then((res) => setExams(res));
    }
  }, [user]);

  const { i18n, t } = useTranslation();

  useEffect(() => {
    setDate((selectedDate) => selectedDate.locale(i18n.language));
  }, [i18n.language]);

  const handleDecreaseMonth = () => {
    setDate(selectedDate.month(selectedDate.month() - 1));
  };

  const handleIncreaseMonth = () => {
    setDate(selectedDate.month(selectedDate.month() + 1));
  };

  const handleToday = () => {
    setDate(Dates.getToday());
  };

  const refreshExams = () => {
    getExams()
      .then(setExams)
      .catch((error) => {
        console.error('Failed to load exams:', error);
      });
  };

  useEffect(() => {
    refreshExams();
  }, []);

  const examsByDate = exams.filter((exam) => Dates.getDate(exam.date_time).isSame(selectedDate, 'date'));

  const calendarItem = (
    <ExamCalendar
      calendar={exams}
      date={selectedDate}
      setDate={setDate}
      onDecrease={handleDecreaseMonth}
      onIncrease={handleIncreaseMonth}
      onToday={handleToday}
      setDateClicked={setDateClicked}
    />
  );

  const ExamContainer = styled.div`
    margin-bottom: 1rem; // Adjust spacing as needed
    padding: 1rem;
    background-color: var(--card-bg-color); // Use a background color to make each card stand out
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  `;

  const panelItem =
    examsByDate.length > 0 ? (
      examsByDate.map((exam) => (
        <ExamContainer key={exam.id}>
          <ExamTeacher exam={exam} onDeleteSuccess={refreshExams} />
        </ExamContainer>
      ))
    ) : (
      <ExamNotFound />
    );

  return (
    <DashboardCard title={t('medical-dashboard.examPlan.title')}>
      <RowStyled gutter={[10, 10]} wrap={false}>
        {isTablet ? (
          <>
            <BaseCol md={12}>{calendarItem}</BaseCol>
            <BaseCol md={12}>{panelItem}</BaseCol>
          </>
        ) : isDateClicked ? (
          <BackButtonWrapper span={24}>
            {panelItem}
            <BackButton type="text" icon={<ArrowLeftOutlined />} onClick={() => setDateClicked(false)} />
          </BackButtonWrapper>
        ) : (
          <BaseCol span={24}>{calendarItem}</BaseCol>
        )}
      </RowStyled>
    </DashboardCard>
  );
};

const BackButtonWrapper = styled(BaseCol)`
  position: relative;
`;

const BackButton = styled(BaseButton)`
  position: absolute;
  top: 0;
  left: 0;
  color: var(--white);
`;

const RowStyled = styled(BaseRow)`
  min-height: 21.75rem;
`;

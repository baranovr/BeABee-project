import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScreeningsHeader } from '../ScreeningsHeader/ScreeningsHeader';
import { ScreeningsFriends } from '../screeningsFriends/ScreeningsFriends/ScreeningsFriends';
import { ScreeningsChart } from '../ScreeningsChart/ScreeningsChart';
import { getTeacherValuesList, TeacherValues } from '@app/api/top.teacher.val.prevval.api';
import { Dates } from '@app/constants/Dates';
import { getStatistics, Statistic } from '@app/api/statistics.api';
import { getSmoothRandom } from '@app/utils/utils';
import { getTopTeachersList, TopTeacher } from '@app/api/top.teachers.names.list.api';
import * as S from './ScreeningsCard.styles';

export interface CurrentStatisticsState {
  firstUser: number;
  secondUser: number;
  month: number;
  statistic: number;
}

export type ScreeningWithTeachers = TeacherValues & { name: string; teacher_avatar: string };

export const ScreeningsCard: React.FC = () => {
  const [top_teachers, setTopTeachers] = useState<TopTeacher[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [teacher_values, setTeacherValues] = useState<TeacherValues[]>([]);
  const [currentStatistics, setCurrentStatistics] = useState<CurrentStatisticsState>({
    firstUser: 1,
    secondUser: 3,
    month: Dates.getToday().get('month'),
    statistic: 2,
  });
  const [isFirstClick, setFirstClick] = useState(true);

  useEffect(() => {
    getTeacherValuesList().then((res) => setTeacherValues(res));
  }, []);

  useEffect(() => {
    getStatistics().then((res) => setStatistics(res));
  }, []);

  useEffect(() => {
    getTopTeachersList().then((res) => setTopTeachers(res));
  }, []);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  const screeningsWithTeachers = useMemo((): ScreeningWithTeachers[] => {
    return teacher_values.map((teacher_value) => {
      const currentTeacher = top_teachers.find((top_teacher) => top_teacher.id === teacher_value.id);

      return {
        ...teacher_value,
        name: currentTeacher?.name || '',
        teacher_avatar: currentTeacher?.teacher_avatar || '',
      };
    });
  }, [top_teachers, teacher_values]);

  const generateScreeningValue = () => {
    const randomValue = getSmoothRandom(3, 0.7) * 25;
    return (randomValue * Math.abs(Math.sin(randomValue))).toFixed();
  };

  const values = useMemo(
    () =>
      months.map((month) => ({
        monthId: month,
        data: statistics.map((statistic) => ({
          statisticId: statistic.id,
          data: teacher_values.map((teacher_value) => ({
            id: teacher_value.id,
            data: Array.from({ length: 31 }, (_, index) => ({
              day: index,
              value: generateScreeningValue(),
            })),
          })),
        })),
      })),
    [months, teacher_values, statistics],
  );

  const currentValues = useMemo(
    () =>
      values
        .find((month) => month.monthId === currentStatistics.month)
        ?.data.find((statistic) => statistic.statisticId === currentStatistics.statistic)?.data,
    [currentStatistics.month, currentStatistics.statistic, values],
  );

  const getUserStatistic = useCallback(
    (isFirstUser: boolean) => {
      const user = isFirstUser ? 'firstUser' : 'secondUser';
      const teacherIndex = currentStatistics[user];
      const teacher = screeningsWithTeachers[teacherIndex];

      if (!teacher || !currentValues || !currentValues[teacherIndex]) {
        console.warn(`Invalid user index or missing data for ${user}`);
        return null;
      }
      return {
        name: teacher.name,
        data: currentValues[teacherIndex]?.data,
      };
    },
    [currentStatistics, currentValues, screeningsWithTeachers],
  );

  return (
    <S.ScreeningsCard
      title={<ScreeningsHeader currentStatistics={currentStatistics} setCurrentStatistics={setCurrentStatistics} />}
      padding={0}
    >
      <ScreeningsFriends
        screenings={screeningsWithTeachers}
        currentStatistics={currentStatistics}
        setCurrentStatistics={setCurrentStatistics}
        isFirstClick={isFirstClick}
        setFirstClick={setFirstClick}
      />
      <ScreeningsChart firstUser={getUserStatistic(true)} secondUser={getUserStatistic(false)} />
    </S.ScreeningsCard>
  );
};

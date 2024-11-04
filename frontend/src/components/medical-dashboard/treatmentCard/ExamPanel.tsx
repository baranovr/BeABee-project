// ExamPanel.tsx

import React, { useEffect, useState } from 'react';
import { getExamCalendar, CalendarExam } from '@app/api/calendar.api';
import { Exam, getExams } from '@app/api/exams.api';
import { ExamTeacher } from './ExamTeacher/ExamTeacher';
import { ExamNotFound } from './ExamNotFound/ExamNotFound';

export const ExamPanel: React.FC<{ userId: number }> = ({ userId }) => {
  const [calendarExams, setCalendarExams] = useState<CalendarExam[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCalendarExams = await getExamCalendar(userId);
      const fetchedExams = await getExams();
      setCalendarExams(fetchedCalendarExams);
      setExams(fetchedExams);
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      {calendarExams.map((calendarExam) => {
        const matchedExam = exams.find((exam) => exam.id === calendarExam.exam);

        return matchedExam ? (
          <ExamTeacher key={calendarExam.exam} exam={matchedExam} />
        ) : (
          <ExamNotFound key={calendarExam.exam} />
        );
      })}
    </div>
  );
};

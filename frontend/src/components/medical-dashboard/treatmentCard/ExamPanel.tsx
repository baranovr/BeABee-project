import React, { useEffect, useState } from 'react';
import { CalendarEvent } from 'api/calendar.api';
import { getTeachersData, Teacher } from '@app/api/doctors.api';
import { ExamTeacher } from './ExamTeacher/ExamTeacher';
import { specifities } from '@app/constants/specifities';
import { ExamNotFound } from './ExamNotFound/ExamNotFound';

interface ExamPanelProps {
  event?: CalendarEvent;
}

export const ExamPanel: React.FC<ExamPanelProps> = ({ event }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    getTeachersData().then((res) => setTeachers(res));
  }, []);

  const currentTeacher = teachers.find((teacher) => teacher.id === event?.teacher);

  if (event && currentTeacher) {
    const teacher: ExamTeacher = {
      name: currentTeacher.name,
      address: currentTeacher.address,
      date: event.date,
      imgUrl: currentTeacher.imgUrl,
      phone: currentTeacher.phone,
      speciality: specifities.find(({ id }) => id === currentTeacher.specifity)?.name || '',
    };

    return <ExamTeacher teacher={teacher} />;
  } else {
    return <ExamNotFound />;
  }
};

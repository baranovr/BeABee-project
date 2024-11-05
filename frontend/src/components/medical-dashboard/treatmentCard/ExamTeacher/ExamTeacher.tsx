// ExamTeacher.tsx:

import React from 'react';
import { Exam } from '@app/api/exams.api';
import * as S from './ExamTeacher.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const ExamTeacher: React.FC<{ exam: Exam }> = ({ exam }) => {
  return (
    <S.TeacherCard>
      <S.TeacherCardBody>
        <BaseAvatar src={exam.teacher.teacher_avatar} size={128} alt="Teacher Avatar" />
        <S.TeacherName>
          {exam.teacher.full_name_sur}, {exam.subject}
        </S.TeacherName>
      </S.TeacherCardBody>

      <S.TeacherCardBody>
        <BaseRow gutter={[16, 16]}>
          <S.LabelCol span={12}>Date & time:</S.LabelCol>
          <S.ValueCol span={12}>{formatDate(exam.date_time)}</S.ValueCol>

          <S.LabelCol span={12}>Group:</S.LabelCol>
          <S.ValueCol span={12}>{exam.group}</S.ValueCol>

          <S.LabelCol span={12}>Type:</S.LabelCol>
          <S.ValueCol span={12}>{exam.type}</S.ValueCol>

          <S.LabelCol span={12}>Details:</S.LabelCol>
          <S.ValueCol span={12}>{exam.details}</S.ValueCol>
        </BaseRow>
      </S.TeacherCardBody>
    </S.TeacherCard>
  );
};

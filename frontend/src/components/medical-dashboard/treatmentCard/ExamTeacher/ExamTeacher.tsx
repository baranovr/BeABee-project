import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ExamTeacher.styles';
import { Dates } from '@app/constants/Dates';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';

export interface ExamTeacher {
  name: string;
  imgUrl: string;
  speciality: string;
  date: number;
  address: string;
  phone: string;
}

interface ExamTeacherProps {
  teacher: ExamTeacher;
}

export const ExamTeacher: React.FC<ExamTeacherProps> = ({ teacher }) => {
  const { t } = useTranslation();

  const { name, speciality, address, imgUrl, phone, date } = teacher;

  return (
    <S.TeacherCard padding={'1rem'}>
      <S.TeacherCardBody>
        <BaseAvatar src={imgUrl} alt={teacher.name} size={128} />

        <S.TeacherName>{`${name}, ${t(`common.${speciality}`)}`}</S.TeacherName>
        <BaseRow gutter={[8, 8]}>
          <S.LabelCol span={10}>{t('common.dateTime')}</S.LabelCol>
          <S.ValueCol span={14}>{Dates.format(date, 'lll')}</S.ValueCol>
          <S.LabelCol span={10}>{t('common.address')}</S.LabelCol>
          <S.ValueCol span={14}>{address}</S.ValueCol>
          <S.LabelCol span={10}>{t('common.phone')}</S.LabelCol>
          <S.ValueCol span={14}>
            <S.Tel href={`tel:${phone}`}>{phone}</S.Tel>
          </S.ValueCol>
        </BaseRow>
      </S.TeacherCardBody>
    </S.TeacherCard>
  );
};

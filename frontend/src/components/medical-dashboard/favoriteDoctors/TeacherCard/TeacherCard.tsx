// TeacherCard.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dates } from 'constants/Dates';
import * as S from './TeacherCard.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseImage } from '@app/components/common/BaseImage/BaseImage';

interface Subject {
  id: number;
  name: string;
}

interface TeacherCardProps {
  full_name_sur?: string;
  subjects?: Subject[];
  degree?: string;
  teacher_avatar?: string;
  email: string;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ full_name_sur, subjects, degree, teacher_avatar, email }) => {
  const { t } = useTranslation();

  const subjectNames = subjects?.map((s) => s.name).join(', ');

  return (
    <S.TeacherCard padding="16px">
      <BaseRow gutter={[{}, { xxl: 10 }]}>
        <BaseCol span={24}>
          <S.ImgWrapper>
            <BaseImage src={teacher_avatar} alt={full_name_sur} preview={false} />
          </S.ImgWrapper>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow>
            <BaseCol span={24}>
              <S.Title>{t('common.teacher')}</S.Title>
            </BaseCol>

            <BaseCol span={24}>
              <S.Text>{full_name_sur}</S.Text>
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow>
            <BaseCol span={24}>
              <S.Title>{t('common.subject')}</S.Title>
            </BaseCol>

            <BaseCol span={24}>
              <S.Text>{subjectNames}</S.Text>
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow>
            <BaseCol span={24}>
              <S.Title>{t('common.degree')}</S.Title>
            </BaseCol>

            <BaseCol span={24}>
              <S.Text>{degree}</S.Text>
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow>
            <BaseCol span={24}>
              <S.Title>{t('Email')}</S.Title>
            </BaseCol>

            <BaseCol span={24}>
              <S.Text>{email}</S.Text>
            </BaseCol>
          </BaseRow>
        </BaseCol>
      </BaseRow>
    </S.TeacherCard>
  );
};

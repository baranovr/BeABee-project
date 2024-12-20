// AllTeachersCard.tsx

import React, { useEffect, useState } from 'react';
import { DashboardCard } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
import { BaseCarousel } from '@app/components/common/BaseCarousel/Carousel';
import { TeacherCard } from '@app/components/medical-dashboard/favoriteDoctors/TeacherCard/TeacherCard';
import { Teacher, getTeachersData } from '@app/api/teachers.api';
import * as S from './AllTeachersCard.styles';
import { BREAKPOINTS } from '@app/styles/themes/constants';


/* eslint-disable @typescript-eslint/no-explicit-any */
const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return <S.SliderArrow className={className} style={{ ...style, display: 'block' }} onClick={onClick} />;
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return <S.SliderArrow className={className} style={{ ...style, display: 'block' }} onClick={onClick} />;
};

export const AllTeachersCard: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const refreshTeachers = () => {
    getTeachersData()
      .then(setTeachers)
      .catch((error) => {
        console.error('Failed to load teachers:', error);
      });
  };

  useEffect(() => {
    refreshTeachers();
  }, []);

  return (
    <DashboardCard title={'All teachers'} padding="0 20px">
      {teachers.length > 0 && (
        <S.CarouselWrapper>
          <BaseCarousel
            arrows={true}
            nextArrow={<NextArrow />}
            prevArrow={<PrevArrow />}
            slidesToShow={4}
            responsive={[
              {
                breakpoint: 1931,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 1530,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: BREAKPOINTS.xl - 1,
                settings: {
                  slidesToShow: 4,
                },
              },
              {
                breakpoint: 1140,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 920,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: BREAKPOINTS.md - 1,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 720,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 520,
                settings: {
                  slidesToShow: 1,
                },
              },
            ]}
          >
            {teachers.map((teacher) => (
              <div key={teacher.id}>
                <TeacherCard
                  id={teacher.id}
                  teacher_avatar={teacher.teacher_avatar}
                  full_name_sur={teacher.full_name_sur}
                  subjects={teacher.subjects}
                  degree={teacher.degree}
                  email={teacher.email}
                  onDeleteSuccess={refreshTeachers}
                />
              </div>
            ))}
          </BaseCarousel>
        </S.CarouselWrapper>
      )}
    </DashboardCard>
  );
};

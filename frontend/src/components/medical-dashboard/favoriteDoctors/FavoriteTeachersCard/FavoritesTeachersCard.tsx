import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardCard } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
import { BaseCarousel } from '@app/components/common/BaseCarousel/Carousel';
import { TeacherCard } from '@app/components/medical-dashboard/favoriteDoctors/TeacherCard/TeacherCard';
import { Dates } from '@app/constants/Dates';
import { CalendarEvent, getUserCalendar } from '@app/api/calendar.api';
import { Teacher, getTeachersData } from '@app/api/doctors.api';
import { useAppSelector } from '@app/hooks/reduxHooks';
import * as S from './FavoritesTeachersCard.styles';
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

export const FavoritesTeachersCard: React.FC = () => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState<Teacher[]>([]);
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);

  const user = useAppSelector((state) => state.user.user);

  const today = Dates.getToday();

  useEffect(() => {
    getTeachersData().then((res) => setDoctors(res));
  }, []);

  useEffect(() => {
    user && getUserCalendar(user.id).then((res) => setCalendar(res));
  }, [user]);

  const pastEvents = useMemo(
    () => calendar.filter((event) => Dates.getDate(event.date).isBefore(today)),
    [calendar, today],
  );

  return (
    <DashboardCard title={'All teachers'} padding="0 20px">
      {doctors.length > 0 && calendar.length > 0 && (
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
            {pastEvents.map((event) => {
              const currentDoctor = doctors.find((doctor) => doctor.id === event.teacher);

              return (
                <div key={currentDoctor?.id}>
                  <TeacherCard
                    imgUrl={currentDoctor?.imgUrl}
                    name={currentDoctor?.name}
                    speciality={currentDoctor?.specifity}
                    rating={currentDoctor?.rating}
                    date={event.date}
                  />
                </div>
              );
            })}
          </BaseCarousel>
        </S.CarouselWrapper>
      )}
    </DashboardCard>
  );
};

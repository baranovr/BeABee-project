import React from 'react';
import L, { IconOptions, PointExpression } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

import { ReactComponent as MapBackgroundIcon } from 'assets/icons/map-background.svg';

import * as S from './TeachersMap.styles';
import { useResponsive } from 'hooks/useResponsive';

import { Teacher } from '@app/api/doctors.api';
import { TeacherProfile } from 'components/common/TeacherProfile/TeacherProfile';

const LARGE_MARKER_SIZE: PointExpression = [50, 50];
const MARKER_SIZE: PointExpression = [30, 30];

const defineIconSize = (isDesktop: boolean): PointExpression => {
  return (isDesktop && LARGE_MARKER_SIZE) || MARKER_SIZE;
};

class MarkerTeacher extends L.Icon {
  constructor(props: IconOptions, isDesktop: boolean) {
    const iconSIze = defineIconSize(isDesktop);
    super({
      popupAnchor: iconSIze,
      iconSize: iconSIze,
      ...props,
    });
  }
}

interface TeachersMapProps {
  teachers: Teacher[];
}

export const TeachersMap: React.FC<TeachersMapProps> = ({ teachers }) => {
  const { isDesktop } = useResponsive();

  const mapDoctors = teachers.filter(({ gps }) => gps);

  return (
    <S.TeachersMap>
      <MapBackgroundIcon />
      {mapDoctors.map((marker) => (
        <Marker
          key={marker.id}
          icon={
            new MarkerTeacher(
              {
                iconUrl: marker.imgUrl,
                iconRetinaUrl: marker.imgUrl,
              },
              isDesktop,
            )
          }
          position={[marker.gps?.latitude || 0, marker.gps?.longitude || 0]}
        >
          <Popup>
            <TeacherProfile
              avatar={marker.imgUrl}
              name={marker.name}
              speciality={marker.specifity}
              rating={marker.rating}
            />
          </Popup>
        </Marker>
      ))}
    </S.TeachersMap>
  );
};

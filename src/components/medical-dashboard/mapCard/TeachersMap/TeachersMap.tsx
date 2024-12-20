// TeachersMap.tsx

import React, { useEffect, useState } from 'react';
import L, { IconOptions, PointExpression, LatLngBounds } from 'leaflet';
import { Marker, Popup, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import * as S from './TeachersMap.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import { getUserLocations, UserLocation } from '@app/api/user.location.api';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { Modal, Button } from 'antd';
import axiosInstance from '@app/api/axiosInstance';

import { ReactComponent as MapBackgroundIcon } from '@app/assets/icons/map-background.svg';

const LARGE_MARKER_SIZE: PointExpression = [50, 50];
const MARKER_SIZE: PointExpression = [30, 30];

// Определяем границы карты
const MAX_BOUNDS: LatLngBounds = new L.LatLngBounds(
  [-85, -180], // Южная широта, западная долгота
  [85, 180], // Северная широта, восточная долгота
);

const defineIconSize = (isDesktop: boolean): PointExpression => {
  return isDesktop ? LARGE_MARKER_SIZE : MARKER_SIZE;
};

class MarkerStudent extends L.Icon {
  constructor(props: IconOptions, isDesktop: boolean) {
    const iconSize = defineIconSize(isDesktop);

    // Проверка наличия iconUrl
    if (!props.iconUrl) {
      props.iconUrl = '/default-avatar.png'; // Путь к дефолтной аватарке
    }

    super({
      popupAnchor: iconSize,
      iconSize,
      ...props,
    });
  }
}

const TeachersMapContent: React.FC<{
  userLocations: UserLocation[];
  isDesktop: boolean;
  onMapClick: (location: UserLocation | null, lat: number, lng: number) => void;
  tempLocation?: { userId: number; lat: number; lng: number } | null;
  currentUserId: number;
}> = ({ userLocations, isDesktop, onMapClick, tempLocation, currentUserId }) => {
  const map = useMapEvents({
    click(e) {
      const currentUserLocation = userLocations.find((loc) => loc.user?.id === currentUserId);
      // Проверяем, находится ли клик в пределах допустимых границ
      if (MAX_BOUNDS.contains(e.latlng)) {
        onMapClick(currentUserLocation || null, e.latlng.lat, e.latlng.lng);
      }
    },
  });

  // Устанавливаем ограничения при монтировании компонента
  useEffect(() => {
    if (map) {
      map.setMaxBounds(MAX_BOUNDS);
      map.setMinZoom(2); // Минимальный зум, чтобы предотвратить слишком сильное отдаление
      map.setMaxZoom(18); // Максимальный зум
    }
  }, [map]);

  return (
    <>
      {userLocations
        .filter((location) => location.user)
        .map((location) => {
          const isCurrentUserLocation = location.user.id === currentUserId;

          return (
            <Marker
              key={location.id}
              icon={
                new MarkerStudent(
                  {
                    iconUrl: location.user.avatar,
                    iconRetinaUrl: location.user.avatar,
                  },
                  isDesktop,
                )
              }
              position={
                isCurrentUserLocation && tempLocation
                  ? [tempLocation.lat, tempLocation.lng]
                  : [parseFloat(location.latitude), parseFloat(location.longitude)]
              }
            >
              <Popup>
                <BaseAvatar src={location.user.avatar} alt="User Avatar" shape="circle" size={40} />
              </Popup>
            </Marker>
          );
        })}
    </>
  );
};

export const TeachersMap: React.FC<{ currentUserId: number }> = ({ currentUserId }) => {
  const { isDesktop } = useResponsive();
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    userLocation: UserLocation | null;
    lat: number;
    lng: number;
  } | null>(null);
  const [tempLocation, setTempLocation] = useState<{ userId: number; lat: number; lng: number } | null>(null);

  useEffect(() => {
    getUserLocations().then(setUserLocations);
  }, []);

  const handleConfirmLocation = async () => {
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;

      try {
        const response = await axiosInstance.post('platform/map/', {
          user: currentUserId,
          latitude: lat.toString(),
          longitude: lng.toString(),
        });

        getUserLocations().then(setUserLocations);

        setSelectedLocation(null);
        setTempLocation(null);
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    }
  };

  const handleCancelLocation = () => {
    setSelectedLocation(null);
    setTempLocation(null);
  };

  const handleMapClick = (userLocation: UserLocation | null, lat: number, lng: number) => {
    if (!userLocation || userLocation.user?.id === currentUserId) {
      setSelectedLocation({ userLocation, lat, lng });
      setTempLocation({ userId: currentUserId, lat, lng });
    }
  };

  return (
    <S.TeachersMap>
      <MapBackgroundIcon />
      <TeachersMapContent
        userLocations={userLocations}
        isDesktop={isDesktop}
        onMapClick={handleMapClick}
        tempLocation={tempLocation}
        currentUserId={currentUserId}
      />

      <Modal
        title="Are you here?"
        visible={!!selectedLocation}
        onCancel={handleCancelLocation}
        footer={[
          <Button key="no" onClick={handleCancelLocation}>
            No
          </Button>,
          <Button key="yes" type="primary" onClick={handleConfirmLocation}>
            Yes
          </Button>,
        ]}
      >
        <p>Do you want to set this as your new location?</p>
      </Modal>
    </S.TeachersMap>
  );
};

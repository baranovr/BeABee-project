// user.location.api.ts

import axiosInstance from '@app/api/axiosInstance';

export interface UserLocation {
  id: number;
  user: {
    id: number;
    avatar: string;
  };
  latitude: string;
  longitude: string;
}

export const getUserLocations = async (): Promise<UserLocation[]> => {
  const response = await axiosInstance.get<UserLocation[]>('platform/map/');
  return response.data;
};

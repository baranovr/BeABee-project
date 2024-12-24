import axiosInstance from '@app/api/axiosInstance';

export interface UserGender {
  sex: string;
  date_joined: string;
}

export const getGendersList = async (): Promise<UserGender[]> => {
  const response = await axiosInstance.get<UserGender[]>('user/users/gender-stats/');
  return response.data;
};
